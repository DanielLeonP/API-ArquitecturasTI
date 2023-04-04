const validarCamposm = require('../midlewares/validar-campos');
const validarRolesm = require('../midlewares/validar-roles');
const validarJWTm = require('../midlewares/validarJWT');

module.exports = {
    ...validarCamposm,
    ...validarRolesm,
    ...validarJWTm
}