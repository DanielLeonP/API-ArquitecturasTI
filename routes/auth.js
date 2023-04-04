const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const validarCampos = require('../midlewares/validar-campos');

const router = Router();

// LOGIN - OBTENER TOKEN
router.post('/login',
    [
        check('correo', ' EL correo es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ]
    , login);

module.exports = router;