const jwt = require("jsonwebtoken")

// Generar el token que se le asigna a un usuario
const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid } //Dentro de {} se pueden guardar los valores que quieras
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { expiresIn: '4h' }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });

    })
}
module.exports = {
    generarJWT
}