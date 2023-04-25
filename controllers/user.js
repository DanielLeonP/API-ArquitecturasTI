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

module.exports = {
    userPost
}