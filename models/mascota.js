const { Schema, model } = require('mongoose');
const MascotaSchema = Schema({
    fechaRegistro: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo es obligatorio'],
    },
    idUsuario: {        
        type: Schema.Types.ObjectId,
        ref: 'Mascota',
        required: [true, 'Usuario requierido']
    }
});

module.exports = model('Mascota', MascotaSchema);