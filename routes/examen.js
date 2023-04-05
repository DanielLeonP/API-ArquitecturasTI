const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { ExamenPost, ExamenesByMascotaGet, ExamenesGet, ExamenPut } = require('../controllers/examen');
const { validarJWT } = require('../midlewares/validarJWT');

const router = Router();

// REALIZAR EXAMEN
router.post('/',
    [
        // validarJWT,
        check('idMascota', 'El idMascota es obligatorio').not().isEmpty(),
        check('idMascota', 'idMascota no es un ID válido').isMongoId(),
        validarCampos
    ]
    , ExamenPost);

// OBTENER EXAMENES DE UNA MASCOTA
router.get('/:id',
    [
        // validarJWT,
        check('id', 'id no es un ID válido').isMongoId(),
        validarCampos
    ]
    , ExamenesByMascotaGet);


// VETERINARIO - Obtener todos los examenes pendientes y completados
router.get('/listado/:estado', //Pendiente o Completado
    [
        // Validar que es veterinario
        // validar que estado es

        // validarCampos
    ]
    , ExamenesGet);

// VETERINARIO - RESPONDER EXAMEN
router.put('/:id', //Pendiente o Completado
    [
        // Validar que es veterinario
        check('datos', 'El dato es obligatorio').not().isEmpty(),
        validarCampos
    ]
    , ExamenPut);

module.exports = router;