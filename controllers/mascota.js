const { response, request } = require('express');
const Mascota = require('../models/mascota');
const Examen = require('../models/examen');

// Controller para registrar nuevas mascotas
const MascotaPost = async (req = request, res = response) => {
    const { _id } = req.user;

    const { nombre, especie, raza, sexo, MVZ, edad, castrado } = req.body;
    const fechaRegistro = Date.now()
    const mascota = new Mascota({ fechaRegistro, nombre, idUsuario: _id, especie, raza, sexo, MVZ, edad, castrado });

    // Guardar en DB
    await mascota.save();//Almacena la mascota en la BD

    // Respuesta de que la mascota se registro correctamente
    res.status(201);
    res.json({ 'msg': 'POST Resgistro de Mascota', mascota });
}

// Controller para obetener informacion de una mascota por ID
const MascotaGet = async (req = request, res = response) => {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);

    // Si no se encuentra la mascota
    if (mascota == null) {
        res.status(200).json({ 'msg': `No se encontro mascota con id ${idMascota}` });
        return;
    }
    // Si la mascota no pertenece al usuario que esta solicitando la informacion
    if (mascota.idUsuario.toString() != req.user._id.toString() && req.user.rol !== 'VETERINARIO_ROLE') {
        res.status(200).json({ 'msg': `El usuario no cuenta con una mascota con id ${id}` });
        return;
    }

    // Respuesta con los datos de la mascota
    res.status(200);
    res.json({ 'msg': 'GET mascota por id', mascota });
}

// Controller para obtener informacion de las mascotas que tiene el usuario
const MascotasByUserGet = async (req = request, res = response) => {
    const { _id } = req.user;
    const { limit = 50, desde = 0 } = req.query;
    const query = { idUsuario: _id };
    const [total, mascotas] = await Promise.all([ 
        Mascota.countDocuments(query), 
        Mascota.find(query)
            .limit(Number(limit))
            .skip(Number(desde))
            .sort({ nombre: 1 })
    ]);

    // Respuesta con el total de mascotas y la informacion de cada una de ellas
    res.status(200);
    res.json({ 'msg': 'GET mascotas de un usuario', total, mascotas });
}

// Controller para obtener mascotas que tienen examenes con estado pendiente o completado
const MascotasXEstadoGet = async (req = request, res = response) => {
    const { estado } = req.params;
    const { limit = 50, desde = 0 } = req.query;
    const query = { estado };
    let examenes = await Examen.find(query).select('idMascota')
        .limit(Number(limit))
        .skip(Number(desde))
        .sort({ fechaRealizado: -1 });

    let mascotas = []

    // Para cada examen obtener la informacion de la mascota
    for (let i = 0; i < examenes.length; i++) {
        const mascota = await Mascota.findById(examenes[i].idMascota);
        mascotas.push(mascota);
    }
    const total = mascotas.length;

    // Respuesta con los examenes por el estado con el total de mascotas y su informacion
    res.status(200);
    res.json({ 'msg': `GET Mascotas que tienen examen con estado '${estado}'`, total, mascotas });
}

// Controller para obtener todas las mascotas que se encuentran registradas
const TodasMascotasGet = async (req = request, res = response) => {
    const { limit = 100, desde = 0 } = req.query;
    const query = {};
    const [total, mascotas] = await Promise.all([ 
        Mascota.countDocuments(query), //Cantidad de registros en BD
        Mascota.find(query)
            .limit(Number(limit))
            .skip(Number(desde))
            .sort({ nombre: 1 })
    ]);

    // Respuesta con el total de mascotas y su informacion de cada una
    res.status(200);
    res.json({ 'msg': 'GET todas las mascotas', total, mascotas });
}

// Controller para eliminar una mascota por ID, eliminando el registro de examenes con los que cuenta
const mascotaDelete = async (req = request, res = response) => {
    const { idMascota } = req.params;

    // Eliminar de la BD la mascota y sus examenes
    const examenes = await Examen.deleteMany({ idMascota });
    const mascota = await Mascota.findByIdAndDelete(idMascota);

    // Respuesta basada en si se encontro o no la mascota
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