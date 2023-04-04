const Role = require('../models/role');
const User = require("../models/user");

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

// Verificar correo
const emailExiste = async (correo = '') => {
    const existeEmail = await User.findOne({ correo });
    if (existeEmail) {
        throw new Error(`Correo '${correo}' ya se encuentra registrado`);
    }
}
const existeUsuarioPorId = async (id) => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id '${correo}' no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
};