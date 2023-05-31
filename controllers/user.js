const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

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

const veterinariosGet = async (req = request, res = response) => {

    const { limit = 50, desde = 0 } = req.query;
    const query = { rol: 'VETERINARIO_ROLE' };

    const [total, veterinarios] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        User.countDocuments(query), //Cantidad de registros en BD
        User.find(query)//Se pueden enviar condiciones
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.status(201);
    res.json({ 'msg': 'GET veterinarios', total, veterinarios });
}

const userDelete = async (req = request, res = response) => {
    const { idUsuario } = req.params;

    // Eliminar de la BD
    const user = await User.findByIdAndDelete(idUsuario);

    if (user) {
        res.json({ 'msg': `DELETE usuario con id ${idUsuario} eliminado.`, user });
    } else {
        res.json({ 'msg': `DELETE NO se encontro usuario con  id ${idUsuario}.` });
    }
}

module.exports = {
    userPost,
    veterinariosGet,
    userDelete
}