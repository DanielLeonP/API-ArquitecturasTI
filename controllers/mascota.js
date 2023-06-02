const { response, request } = require('express');
const Mascota = require('../models/mascota');
const Examen = require('../models/examen');

const MascotaPost = async (req = request, res = response) => {
    const { _id } = req.user;

    const { nombre, especie, raza, sexo, MVZ, edad, castrado } = req.body;
    const fechaRegistro = Date.now()
    const mascota = new Mascota({ fechaRegistro, nombre, idUsuario: _id, especie, raza, sexo, MVZ, edad, castrado });

    // Guardar en DB
    await mascota.save();//Almacena el usuario en la BD

    res.status(201);
    res.json({ 'msg': 'POST Resgistro de Mascota', mascota });
}



const MascotaGet = async (req = request, res = response) => {

    console.log(req.user);

    const { id } = req.params;
    const mascota = await Mascota.findById(id);

    if (mascota == null) {
        res.status(200).json({ 'msg': `No se encontro mascota con id ${idMascota}` });
        return;
    }

    if (mascota.idUsuario.toString() != req.user._id.toString() && req.user.rol !== 'VETERINARIO_ROLE') {
        res.status(200).json({ 'msg': `El usuario no cuenta con una mascota con id ${id}` });
        return;
    }


    res.status(200);
    res.json({ 'msg': 'GET mascota por id', mascota });
}

const MascotasByUserGet = async (req = request, res = response) => {
    const { _id } = req.user;

    const { limit = 50, desde = 0 } = req.query;

    const query = { idUsuario: _id };

    const [total, mascotas] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Mascota.countDocuments(query), //Cantidad de registros en BD
        Mascota.find(query)//Se pueden enviar condiciones
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.status(200);
    res.json({ 'msg': 'GET mascotas de un usuario', total, mascotas });
}

const MascotasXEstadoGet = async (req = request, res = response) => {
    const { estado } = req.params;

    const { limit = 50, desde = 0 } = req.query;

    const query = { estado };

    let examenes = await Examen.find(query).select('idMascota')//Se pueden enviar condiciones
        .limit(Number(limit))
        .skip(Number(desde));


    let mascotas = []
    for (let i = 0; i < examenes.length; i++) {
        const mascota = await Mascota.findById(examenes[i].idMascota);
        mascotas.push(mascota);

    }
    const total = mascotas.length;

    res.status(200);
    res.json({ 'msg': `GET Mascotas que tienen examen con estado '${estado}'`, total, mascotas });
}

const TodasMascotasGet = async (req = request, res = response) => {

    const { limit = 100, desde = 0 } = req.query;

    const query = {};

    const [total, mascotas] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Mascota.countDocuments(query), //Cantidad de registros en BD
        Mascota.find(query)//Se pueden enviar condiciones
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.status(200);
    res.json({ 'msg': 'GET todas las mascotas', total, mascotas });
}

const mascotaDelete = async (req = request, res = response) => {
    const { idMascota } = req.params;

    // Eliminar de la BD
    const examenes = await Examen.deleteMany({ idMascota });

    const mascota = await Mascota.findByIdAndDelete(idMascota);


    if (mascota) {
        res.json({ 'msg': `DELETE mascota con id ${idMascota} eliminada.`, mascota, examenesEliminados: examenes });
    } else {
        res.json({ 'msg': `DELETE NO se encontro mascota con  id ${idMascota}.` });
    }

}

module.exports = {
    MascotaPost,
    MascotaGet,
    MascotasByUserGet,
    MascotasXEstadoGet,
    TodasMascotasGet,
    mascotaDelete
}