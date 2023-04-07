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
    especie: {
        type: String,
        required: [true, 'El tipo es obligatorio'],
    },
    raza: {
        type: String,
        required: [true, 'La raza es obligatoria'],
    },
    sexo: {
        type: String,
        required: [true, 'El sexo es obligatorio'],
    },
    MVZ: {
        type: String,
        required: [true, 'El MVZ es obligatorio'],
    },
    edad: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
    },
    castrado: {
        type: String,
        required: [true, 'Si es o no castrado es obligatorio'],
    },
    idUsuario: {        
        type: Schema.Types.ObjectId,
        ref: 'Mascota',
        required: [true, 'Usuario requierido']
    }
});

module.exports = model('Mascota', MascotaSchema);