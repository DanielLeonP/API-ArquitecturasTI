const { response, request } = require('express');
const Examen = require('../models/examen');

const ExamenPost = async (req = request, res = response) => {

    const { idMascota } = req.body;

    const idExamen = "IDEXAMENPRUEBA";

    const examen = new Examen({ idExamen, idMascota });

    // Guardar en DB
    await examen.save();//Almacena el usuario en la BD

    res.status(201);
    res.json({ 'msg': 'POST Examen de mascota', examen });
}


const ExamenesByMascotaGet = async (req = request, res = response) => {
    const { id } = req.params;

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
    const { datos } = req.body;
    const { id } = req.params;
    const fechaRealizado = new Date();


    const examen = await Examen.findByIdAndUpdate(id, { datos, fechaRealizado, estado: 'Completado' }, { new: true });

    res.status(201);
    res.json({ 'msg': 'PUT Examen de mascota', examen });
}


module.exports = {
    ExamenPost,
    ExamenesByMascotaGet,
    ExamenesGet,
    ExamenPut
}