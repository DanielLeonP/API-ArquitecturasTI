const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { ExamenPost, ExamenesByMascotaGet } = require('../controllers/examen');
const { validarJWT } = require('../midlewares/validarJWT');

const router = Router();

// REALIZAR EXAMEN
router.post('/',
    [
        // validarJWT,
        check('datoPrueba', 'El dato es obligatorio').not().isEmpty(),
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

module.exports = router;