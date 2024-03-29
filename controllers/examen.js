const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit-table');

const { response, request } = require('express');

const Examen = require('../models/examen');
const Mascota = require('../models/mascota');
const User = require('../models/user');

// Controller para formulario de generar un nuevo examen
const ExamenPost = async (req = request, res = response) => {
    const { idMascota, tipoExamen } = req.body;
    const mascota = await Mascota.findById(idMascota);

    // Si no existe la mascota
    if (mascota == null) {
        res.status(200).json({ 'msg': `No se encontro mascota con id ${idMascota}` });
        return;
    }

    // Si la mascota no es del usuario
    if (mascota.idUsuario.toString() != req.user._id.toString()) {
        res.status(200).json({ 'msg': `El usuario no cuenta con una mascota con id ${idMascota}` });
        return;
    }

    // Guardar en DB
    const examen = new Examen({ idMascota, tipoExamen });//idExamen,
    await examen.save();//Almacena el usuario en la BD

    // Respuesta de que se realizo el POST del examen con su respectivo objeto
    res.status(201);
    res.json({ 'msg': 'POST Examen de mascota', examen });
}

// Controller de obtener los examenes filtrados por mascota
const ExamenesByMascotaGet = async (req = request, res = response) => {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);

    // Si no existe la mascota
    if (mascota == null) {
        res.status(200).json({ 'msg': `No se encontro mascota con id ${id}` });
        return;
    }
    // Si la mascota no pertenece al usuario
    if (mascota.idUsuario.toString() != req.user._id.toString()) {
        res.status(200).json({ 'msg': `El usuario no cuenta con una mascota con id ${id}` });
        return;
    }

    const { limit = 20, desde = 0 } = req.query;
    const query = { idMascota: id };
    const [total, examen] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Examen.countDocuments(query), //Cantidad de registros en BD
        Examen.find(query)//Se pueden enviar condiciones
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    // Respuesta de GET con el total de examenes y los datos que contienen
    res.status(200);
    res.json({ 'msg': 'GET examenes por mascota', total, examen });
}

// Controller de examenes filtrados por estado pendiente o completado
const ExamenesGet = async (req = request, res = response) => {
    const { estado } = req.params;
    const { limit = 20, desde = 0 } = req.query;
    const query = { estado };
    const [total, examenes] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Examen.countDocuments(query), //Cantidad de registros en BD
        Examen.find(query)//Se pueden enviar condiciones
            .sort({ fechaSolicitud: 1 })
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    let examenesInfo = [];

    // Para cada examen obtener la informacion de la mascota y del usuario correspondiente
    for (let i = 0; i < examenes.length; i++) {
        let examen = examenes[i];
        let mascota = await Mascota.findById(examenes[i].idMascota);
        let usuario = await User.findById(mascota.idUsuario);
        examenesInfo.push({ examen, mascota, usuario })
    }

    // Respuesta del GET con el total de examenes y la informacion de cada uno
    res.status(200);
    res.json({ 'msg': `GET examenes por estado '${estado}'`, total, examenes: examenesInfo });
}

// Controller para actualizar la informacion del examen con la respuesta del veterinario
const ExamenPut = async (req = request, res = response) => {
    let { datos } = req.body;
    const { id } = req.params;
    const fechaRealizado = new Date();

    /* Datos para generar la ruta y el nombre del archivo */
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();
    let numExam = 0;
    const carpetaAnio = path.join(__dirname, `../files/${anioActual}`);
    const carpetaMes = path.join(__dirname, `../files/${anioActual}/${mesActual}`);
    let entraTRY = false;
    try {
        if (!fs.existsSync(carpetaAnio)) {
            fs.mkdirSync(carpetaAnio);
        }
        if (!fs.existsSync(carpetaMes)) {
            fs.mkdirSync(carpetaMes);
        }

        const files = fs.readdirSync(carpetaMes);
        const cantidadArchivos = files.length;
        numExam = cantidadArchivos + 1;
        entraTRY = true;
    } catch (error) {
        console.log(error);
    }

    const idExamen = `Ex${numExam}-${mesActual}-${anioActual}`;

    // Verifica que el examen no se encuentre en un estado completado
    const estadoExamen = await Examen.findById(id);
    // console.log(estadoExamen)
    if (estadoExamen.estado == 'Completado') {
        return res.status(200).json({ msg: `El examen con id ${id} ya ha sido completado el ${estadoExamen.fechaRealizado}` });
    }

    // Si el examen no esta completado, Busca el examen y ve si existe
    const examen = await Examen.findByIdAndUpdate(id, { idExamen, datos, fechaRealizado, estado: 'Completado' }, { new: true });
    if (!examen) {
        res.status(204).json({ 'msg': 'El examen no fue encontrado' });
        return;
    }

    /* SI EXISTE el examen, continua el generar el PDF */
    console.log('Generando PDF ------------');
    try {
        if (entraTRY) {
            // PDFDocument permite realizar PDFs ingresando imagenes, textos, tablas, etc.
            const doc = new PDFDocument();

            doc.pipe(fs.createWriteStream(`${carpetaMes}/${idExamen}.pdf`));

            /** CONTENIDO DEL PDF ----------------------------------------------------------------*/

            /** OBTENER DATOS DE LA MASCOTA */
            const mascota = await Mascota.findById(examen.idMascota);
            const usuario = await User.findById(mascota.idUsuario);
            console.log({ examen, mascota, usuario });

            // Imagen Logo Ciencias Naturales
            doc.image(path.join(__dirname, '../public/images/FacultadCN.png'), 0, 15, { width: 598, align: 'center' });

            // Titulo Resultados
            doc.fontSize(20);
            doc.font('Times-Bold');
            doc.moveDown(2);
            await doc.text(`Resultado ${examen.tipoExamen}`, { align: 'center', lineGap: 10 });

            // Datos del examen
            doc.fontSize(16);
            doc.font('Times-Bold');
            await doc.text(`Información del Examen`, { align: 'center', lineGap: 10 });
            doc.font('Times-Roman');
            await doc.text(`Id del examen : ${examen.idExamen}`);
            await doc.text(`Estado: ${examen.estado}`);
            await doc.text(`Fecha de solicitud de examen: ${examen.fechaSolicitud}`);
            await doc.text(`Fecha de respuesta de examen: ${examen.fechaRealizado}`);
            await doc.text(`Tipo de Examen: ${examen.tipoExamen}`, { lineGap: 10 });

            // Datos de la mascota
            doc.font('Times-Bold');
            await doc.text(`Información de la mascota`, { align: 'center', lineGap: 10 });
            doc.font('Times-Roman');
            await doc.text(`Nombre:  ${mascota.nombre}`);
            await doc.text(`Especie:  ${mascota.especie}`);
            await doc.text(`Raza:  ${mascota.raza}`);
            await doc.text(`Sexo:  ${mascota.sexo}`);
            await doc.text(`MVZ:  ${mascota.MVZ}`);
            await doc.text(`Edad:  ${mascota.edad} años`);
            await doc.text(`Castrado:  ${mascota.castrado}`, { lineGap: 10 });

            // Datos del usuario
            doc.font('Times-Bold');
            await doc.text(`Informacion del usuario`, { align: 'center', lineGap: 10 });
            doc.font('Times-Roman');
            await doc.text(`Nombre:  ${usuario.nombre}`);
            await doc.text(`Correo:  ${usuario.correo}`, { lineGap: 10 });

            // Datos de resultados dentro de tablas
            doc.addPage();
            doc.font('Times-Bold');
            doc.moveDown(1);
            for (let dato in datos) {
                let objeto = datos[dato];
                // console.log(objeto)
                if (typeof datos[dato] === 'object') {
                    let lineas = [];
                    for (let info in objeto) {
                        lineas.push([info, objeto[info]]);
                    }
                    const table = { headers: [dato, 'Valor'], rows: lineas };
                    await doc.table(table);
                } else {
                    const table = { headers: ['', ''], rows: [[dato, datos[dato]]] };
                    // console.log(table)
                    await doc.table(table);
                }
                doc.moveDown(1);
            }
            doc.end();

            console.log('PDF Realizado ------------');

            // Respuesta de PUT con toda la informacion que contiene el objeto examen
            res.status(201);
            res.json({ 'msg': 'PUT Examen de mascota', examen });
        } else {
            // Respuesta en caso de que el PDF no se puede generar el pdf (Error de Vercel probablemente)
            res.status(201);
            res.json({ 'msg': 'PUT Registro exitoso, pero el PDF no se pudo generar', examen });
        }

    } catch (error) {
        // Respuesta en caso de que el PDF no se puede generar el pdf (Error de Vercel probablemente)
        res.status(201);
        res.json({ 'msg': 'PUT Registro exitoso, pero el PDF no se pudo generar', examen });
    }
}

// Controller para obtener la informacion del examen, mascota y usuario filtrada por el id de un examen
const MasInfoExamenGet = async (req = request, res = response) => {
    const { idExamen } = req.params;
    const examen = await Examen.findById(idExamen);

    // Si no se encuentra el examen
    if (examen == null) {
        res.status(200).json({ 'msg': `No se encontro examen con id ${idExamen}` });
        return;
    }

    const mascota = await Mascota.findById(examen.idMascota);
    const usuario = await User.findById(mascota.idUsuario);

    // Respuesta GET con la informacion del examen, mascota y usuario
    res.status(200);
    res.json({ 'msg': 'GET informacion de examen, mascota y usuario', examen, mascota, usuario });
}

// Controller para eliminar un examen por ID
const examenDelete = async (req = request, res = response) => {
    const { idExamen } = req.params;

    // Eliminar de la BD
    const examen = await Examen.findByIdAndDelete(idExamen);

    if (examen) {
        res.json({ 'msg': `DELETE examen con id ${idExamen} eliminado.`, examen });
    } else {
        res.json({ 'msg': `DELETE NO se encontro examen con  id ${idExamen}.` });
    }
}

module.exports = {
    ExamenPost,
    ExamenesByMascotaGet,
    ExamenesGet,
    ExamenPut,
    MasInfoExamenGet,
    examenDelete
}