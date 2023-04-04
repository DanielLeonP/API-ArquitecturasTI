const { Schema, model } = require('mongoose');

const ExamenSchema = Schema({
    idExamen: {
        type: String,
        required: [true, 'El idExamen es obligatorio']
    },
    fechaRealizado: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
    },
    datoPrueba: {
        type: String,
        required: [true, 'El dato es obligatorio']
    },
    idMascota: {
        type: Schema.Types.ObjectId,
        ref: 'Mascota',
        required: [true, 'Mascota requierida']
    }
});

module.exports = model('Examen', ExamenSchema);