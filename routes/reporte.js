const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { validarJWT } = require('../midlewares/validarJWT');
const { ReporteGet, EnviarMailGet } = require('../controllers/reporte');
const { esVeterinario } = require('../midlewares/validar-roles');

const router = Router();


//Ruta para obtener el listado de examenes para el reporte -  Solo para VETERINARIO
router.get('/',
    [
        validarJWT,
        esVeterinario,
        validarCampos
    ]
    , ReporteGet);

// Ruta que permite realizar el envio de correo al usuario que solicito un examen
router.get('/enviarCorreo/:id',
    [
        validarJWT,
        esVeterinario,
        check('id', 'El id (id del examen) es obligatorio').not().isEmpty(),
        validarCampos
    ]
    , EnviarMailGet);

module.exports = router;