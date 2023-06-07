const mongoose = require('mongoose');

// Configuracion para conexion a la base de datos
const dbConection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a la base de datos');
    } catch (error) {
        throw new Error('Error en el inicio de la base de datos.');
    }
}
module.exports = {
    dbConection
};