const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { validarJWT } = require('../midlewares/validarJWT');
const { ReporteGet, EnviarMailGet } = require('../controllers/reporte');

const router = Router();


// VETERINARIO - Reporte
router.get('/', //Pendiente o Completado
    [
        // Validar que es veterinario
        // validarCampos
    ]
    , ReporteGet);

router.get('/enviarCorreo/', //Pendiente o Completado
    [
        // Validar que es veterinario
        check('correo', 'El correo es obligatorio').not().isEmpty(),//.isEmail(),
        validarCampos
    ]
    , EnviarMailGet);

module.exports = router;