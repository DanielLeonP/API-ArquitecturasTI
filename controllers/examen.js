const { response, request } = require('express');
const Examen = require('../models/examen');

const ExamenPost = async (req = request, res = response) => {

    const { datoPrueba, idMascota } = req.body;

    const fechaRealizado = Date.now()
    const idExamen = "IDEXAMENPRUEBA";

    const examen = new Examen({ idExamen, fechaRealizado, datoPrueba, idMascota });

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

module.exports = {
    ExamenPost,
    ExamenesByMascotaGet
}