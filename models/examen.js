const { Schema, model } = require('mongoose');

const ExamenSchema = Schema({
    idExamen: {
        type: String//,
        // required: [true, 'El idExamen es obligatorio']
    },
    estado: {
        type: String,
        required: [true, 'El estado es obligatorio'],
        default: 'Pendiente'
    },
    fechaSolicitud: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
        default: Date.now
    },
    fechaRealizado: {
        type: Date
    },
    tipoExamen: {
        type: String,
        required: [true, 'El tipo de examen es obligatorio']
    },
    datos: {
        type: Object,
        defatult: ''
    },
    idMascota: {
        type: Schema.Types.ObjectId,
        ref: 'Mascota',
        required: [true, 'Mascota requierida']
    }
});

module.exports = model('Examen', ExamenSchema);