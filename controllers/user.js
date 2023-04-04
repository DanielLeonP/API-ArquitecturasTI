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

const userPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // Validar contra db
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); //10 esta por defecto
        resto.password = bcryptjs.hashSync(password, salt);

    }
    const user = await User.findByIdAndUpdate(id, resto, { new: true });

    res.status(200);
    res.json({ 'msg': 'PUT api', user });
}

const userGet = async (req = request, res = response) => {
    const { limit = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [total, users] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        User.countDocuments(query), //Cantidad de registros en BD
        User.find(query)//Se pueden enviar condiciones
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.status(200);
    res.json({ 'msg': 'GET api', total, users });
}

const userDelete = async (req = request, res = response) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { estado: false });

    res.json({ 'msg': 'DELETE api', user });//, userAuth 
}
const userPatch = (req = request, res = response) => {
    // res.status(200);
    res.json({ 'msg': 'PATCH api' });
}
module.exports = {
    userGet,
    userDelete,
    userPatch,
    userPost,
    userPut
}