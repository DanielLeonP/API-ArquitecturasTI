const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../helpers/generarJWT');

// Controller para verificar los datos ingresados para poder iniciar sesion
const login = async (req = request, res = response) => {
    const { correo, password } = req.body;
    try {
        // Verificar si el correo existe
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - correo' });
        }

        //Verificar si el usuario esta activo
        if (!user.estado) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - estado:false' });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario / Password no son correctos - password' });
        }
        
        // Generar el JWT
        const token = await generarJWT(user.id);

        // Respuesta con los datos del usuario y su respectivo token
        res.status(200).json({ msg: 'Login OK', user, token });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error, hbale con el administrador' });
    }
}

module.exports = {
    login
}