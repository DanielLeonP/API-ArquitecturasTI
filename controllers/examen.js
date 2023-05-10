const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit-table');

const { response, request } = require('express');

const Examen = require('../models/examen');
const Mascota = require('../models/mascota');
const User = require('../models/user');

const ExamenPost = async (req = request, res = response) => {

    const { idMascota, tipoExamen } = req.body;

    const mascota = await Mascota.findById(idMascota);

    if (mascota == null) {
        res.status(200).json({ 'msg': `No se encontro mascota con id ${idMascota}` });
        return;
    }

    if (mascota.idUsuario.toString() != req.user._id.toString()) {
        res.status(200).json({ 'msg': `El usuario no cuenta con una mascota con id ${idMascota}` });
        return;
    }

    // Guardar en DB
    const examen = new Examen({ idMascota, tipoExamen });//idExamen,
    await examen.save();//Almacena el usuario en la BD

    res.status(201);
    res.json({ 'msg': 'POST Examen de mascota', examen });
}


const ExamenesByMascotaGet = async (req = request, res = response) => {
    const { id } = req.params;

    const mascota = await Mascota.findById(id);

    if (mascota == null) {
        res.status(200).json({ 'msg': `No se encontro mascota con id ${id}` });
        return;
    }

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

    res.status(200);
    res.json({ 'msg': 'GET examenes por mascota', total, examen });
}

const ExamenesGet = async (req = request, res = response) => {
    const { estado } = req.params;

    const { limit = 20, desde = 0 } = req.query;

    const query = { estado };

    const [total, examenes] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Examen.countDocuments(query), //Cantidad de registros en BD
        Examen.find(query)//Se pueden enviar condiciones
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.status(200);
    res.json({ 'msg': `GET examenes por estado '${estado}'`, total, examenes });
}

const ExamenPut = async (req = request, res = response) => {
    let { datos } = req.body;
    const { id } = req.params;
    const fechaRealizado = new Date();

    /* AQUI SE DEBE GENERAR EL PDF PARA PODER ALMACENARLO Y POSTERIORMENTE TENER LA OPCION DE ENVIARLO AL USUARIO  */

    /**Nombre que vamos a usar para el archivo*/
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();

    const carpetaAnio = path.join(__dirname, `../files/${anioActual}`);
    const carpetaMes = path.join(__dirname, `../files/${anioActual}/${mesActual}`);
    if (!fs.existsSync(carpetaAnio)) {
        fs.mkdirSync(carpetaAnio);
    }
    if (!fs.existsSync(carpetaMes)) {
        fs.mkdirSync(carpetaMes);
    }

    const files = fs.readdirSync(carpetaMes);
    const cantidadArchivos = files.length;
    const numExam = cantidadArchivos + 1;

    const idExamen = `Ex${numExam}-${mesActual}-${anioActual}`;

    /* Verifica que el examen no se encuentre en un estado completado */
    const estadoExamen = await Examen.findById(id);
    // console.log(estadoExamen)
    if (estadoExamen.estado == 'Completado') {
        return res.status(200).json({ msg: `El examen con id ${id} ya ha sido completado el ${estadoExamen.fechaRealizado}` });
    }


    /* Si el examen no esta completado, Busca el examen y ve si existe */
    const examen = await Examen.findByIdAndUpdate(id, { idExamen, datos, fechaRealizado, estado: 'Completado' }, { new: true });
    if (!examen) {
        res.status(204).json({ 'msg': 'El examen no fue encontrado' });
        return;
    }

    /* SI EXISTE, CONTINUA... */

    /* GENERAR PDF */
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(`${carpetaMes}/${idExamen}.pdf`));
    doc.fontSize(12);

    /** CONTENIDO DEL PDF */

    /** OBTENER DATOS DE LA MASCOTA */
    const mascota = await Mascota.findById(examen.idMascota);
    const usuario = await User.findById(mascota.idUsuario);
    /** TABLA DE DATOS PARA PDF */
    console.log({ examen, mascota, usuario });

    doc.text(`Información del Examen`, { lineGap: 10 });
    doc.text(`Id del examen : ${examen.idExamen}`, { lineGap: 10 });
    doc.text(`Estado: ${examen.estado}`);
    doc.text(`Fecha de solicitud de examen: ${examen.fechaSolicitud}`);
    doc.text(`Tipo de Examen: ${examen.tipoExamen}`, { lineGap: 10 });

    doc.text(`Información de la mascota`, { lineGap: 10 });
    doc.text(`Nombre:  ${mascota.nombre}`);
    doc.text(`Especie:  ${mascota.nombre}`);
    doc.text(`Raza:  ${mascota.raza}`);
    doc.text(`Sexo:  ${mascota.sexo}`);
    doc.text(`MVZ:  ${mascota.mvz}`);
    doc.text(`edad:  ${mascota.edad}`);
    doc.text(`castrado:  ${mascota.castrado}`);

    doc.text(`Informacion del usuario`, { lineGap: 10 });
    doc.text(`Nombre:  ${usuario.nombre}`);
    doc.text(`Correo:  ${usuario.correo}`);

    let lineas = [];
    for (let dato in datos) {
        // console.log(`FUNCIONA ${dato}: ---  ${datos[dato]}`);
        lineas.push([dato, datos[dato]]);
    }
    const table = { title: 'Resultados de examen', headers: ['Dato', 'Resultado'], rows: lineas };
    // console.log(table);
    // Agregar tabla al documento
    await doc.table(table);

    doc.end();



    res.status(201);
    res.json({ 'msg': 'PUT Examen de mascota', examen });

}


module.exports = {
    ExamenPost,
    ExamenesByMascotaGet,
    ExamenesGet,
    ExamenPut
}