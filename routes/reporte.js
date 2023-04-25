const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { validarJWT } = require('../midlewares/validarJWT');
const { ReporteGet, EnviarMailGet } = require('../controllers/reporte');
const { esVeterinario } = require('../midlewares/validar-roles');

const router = Router();


// VETERINARIO - Reporte
router.get('/', //Pendiente o Completado
    [
        validarJWT,
        esVeterinario,
        validarCampos
    ]
    , ReporteGet);

router.get('/enviarCorreo/', //Pendiente o Completado
    [
        validarJWT,
        esVeterinario,
        check('correo', 'El correo es obligatorio').not().isEmpty(),//.isEmail(),
        validarCampos
    ]
    , EnviarMailGet);

module.exports = router;