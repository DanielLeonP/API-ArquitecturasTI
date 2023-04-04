const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { ExamenPost, ExamenesByMascotaGet } = require('../controllers/examen');

const router = Router();

router.post('/',
    [
        // Validaciones
    ]
    , ExamenPost);

router.get('/:id',
    [
        // Validaciones
    ]
    , ExamenesByMascotaGet);

module.exports = router;