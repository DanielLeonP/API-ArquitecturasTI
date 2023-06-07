const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const Mascota = require('../models/mascota');
const Examen = require('../models/examen');

// Controller para registro de usuario
const userPost = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const user = new User({ nombre, correo, password, rol });

    // Encriptar password
    const salt = bcryptjs.genSaltSync(); //10 esta por defecto
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await user.save();//Almacena el usuario en la BD

    res.status(201);
    res.json({ 'msg': 'POST api', user });
}

// Controller para obtener los usuarios registrados con rol de veterinario
const veterinariosGet = async (req = request, res = response) => {
    const { limit = 50, desde = 0 } = req.query;
    const query = { rol: 'VETERINARIO_ROLE' };

    const [total, veterinarios] = await Promise.all([
        User.countDocuments(query), //Cantidad de registros en BD
        User.find(query)
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    // Respuesta con el total de veterinarios y su informacion
    res.status(201);
    res.json({ 'msg': 'GET veterinarios', total, veterinarios });
}

// Controller para eliminar usuarios de la BD por ID, ademas de eliminar las mascotas y sus examenes asociados
const userDelete = async (req = request, res = response) => {
    const { idUsuario } = req.params;

    // Obtener las mascotas pertenecientes al usuario
    const mascotas = await Mascota.find({ idUsuario });

    let examenesEliminados = 0;
    for (let i = 0; i < mascotas.length; i++) {
        // Eliminar los examenes pertenecientes a cada mascota
        const examenes = await Examen.deleteMany({ idMascota: mascotas[i]._id });
        examenesEliminados = examenesEliminados + examenes.deletedCount;
    }

    // Eliminar las mascotas pertenecientes al usuario
    const mascotasEliminadas = await Mascota.deleteMany({ idUsuario });

    // Eliminar el usuario de la BD
    const user = await User.findByIdAndDelete(idUsuario);

    // Respuesta de eliminación del usuario
    if (user) {
        res.json({ 'msg': `DELETE usuario con id ${idUsuario} eliminado.`, user, mascotasEliminadas: mascotasEliminadas.deletedCount, examenesEliminados });
    } else {
        res.json({ 'msg': `DELETE NO se encontro usuario con  id ${idUsuario}.` });
    }
}

module.exports = {
    userPost,
    veterinariosGet,
    userDelete
}