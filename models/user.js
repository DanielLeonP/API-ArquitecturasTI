const { Schema, model } = require('mongoose');

// Esquema de un usuario
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE', 'VETERINARIO_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    }
});
UsuarioSchema.methods.toJSON = function () {//Permite modificar el metodo cuando se llama como json, se da en la
    // respuesta al usuario para poder no mostrar la contraseña y __v
    // const { __v, password, ...user } = this.toObject();
    const { __v, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}
module.exports = model('User', UsuarioSchema);