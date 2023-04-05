const { response, request } = require('express');
const Examen = require('../models/examen');

const ReporteGet = async (req = request, res = response) => {

    const [total, examenes] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Examen.countDocuments(), //Cantidad de registros en BD
        Examen.find()//Se pueden enviar condiciones
    ]);

    res.status(200);
    res.json({ 'msg': 'GET generar reporte', total, examenes });
}
module.exports = {
    ReporteGet
}