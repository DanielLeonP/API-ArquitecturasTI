const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const Usuario = require('../models/user');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(404).json({ msg: 'No hay token en la peticion' });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer usario
        const user = await Usuario.findById(uid);
        
        if (!user) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en bd'
            });
        }
        // Verificar si uidd tiene estado true
        if (!user.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            });
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'Token no valido' });
    }
};
module.exports = {
    validarJWT
}