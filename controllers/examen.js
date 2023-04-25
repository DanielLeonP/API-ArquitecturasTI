const { response, request } = require('express');
const Examen = require('../models/examen');
const Mascota = require('../models/mascota');

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

    const idExamen = "IDEXAMENPRUEBA"; //CAMBIAR A FORMATO QUE DIJO EL PROFE

    const examen = new Examen({ idExamen, idMascota, tipoExamen });

    // Guardar en DB
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


    const examen = await Examen.findByIdAndUpdate(id, { datos, fechaRealizado, estado: 'Completado' }, { new: true });

    if (!examen) {
        res.status(204).json({ 'msg': 'El examen no fue encontrado' });
        return;
    }
    
    
    /* AQUI SE DEBE GENERAR EL PDF PARA PODER ALMACENARLO Y POSTERIORMENTE TENER LA OPCION DE ENVIARLO AL USUARIO  */
    
    
    
    res.status(201);
    res.json({ 'msg': 'PUT Examen de mascota', examen });

}


module.exports = {
    ExamenPost,
    ExamenesByMascotaGet,
    ExamenesGet,
    ExamenPut
}