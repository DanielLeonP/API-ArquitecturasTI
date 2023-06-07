const { Schema, model } = require('mongoose');

// Esquema de un rol
const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});
module.exports = model('Role', RoleSchema);