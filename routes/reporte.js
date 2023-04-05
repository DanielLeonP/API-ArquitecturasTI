const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { validarJWT } = require('../midlewares/validarJWT');
const { ReporteGet } = require('../controllers/reporte');

const router = Router();


// VETERINARIO - Reporte
router.get('/', //Pendiente o Completado
    [
        // Validar que es veterinario
        // validarCampos
    ]
    , ReporteGet);

module.exports = router;