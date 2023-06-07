const Mascota = require('../models/mascota');
const Role = require('../models/role');
const User = require("../models/user");

// Verificar si es un rol valido
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

// Verificar si el usuario existe
const existeUsuarioPorId = async (id) => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id '${id}' no existe`);
    }
}

// Verificar si la mascota existe
const existeMascotaPorId = async (id) => {
    const existeMascota = await Mascota.findById(id);
    if (!existeMascota) {
        throw new Error(`El id '${id}' de mascota no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeMascotaPorId
};