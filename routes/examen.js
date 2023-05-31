const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { ExamenPost, ExamenesByMascotaGet, ExamenesGet, ExamenPut, MasInfoExamenGet, examenDelete } = require('../controllers/examen');
const { validarJWT } = require('../midlewares/validarJWT');
const { esVeterinario } = require('../midlewares/validar-roles');

const router = Router();

// REALIZAR EXAMEN
router.post('/',
    [
        validarJWT,
        check('idMascota', 'El idMascota es obligatorio').not().isEmpty(),
        check('idMascota', 'idMascota no es un ID válido').isMongoId(),
        check('tipoExamen', 'El tipoExamen es obligatorio').not().isEmpty(),
        validarCampos
    ]
    , ExamenPost);

// OBTENER EXAMENES DE UNA MASCOTA
router.get('/:id',
    [
        validarJWT,
        check('id', 'id no es un ID válido').isMongoId(),
        validarCampos
    ]
    , ExamenesByMascotaGet);


// VETERINARIO - Obtener todos los examenes pendientes y completados
router.get('/listado/:estado', //Pendiente o Completado
    [
        validarJWT,
        esVeterinario,
        validarCampos
    ]
    , ExamenesGet);

// VETERINARIO - RESPONDER EXAMEN
router.put('/:id', //Pendiente o Completado
    [
        validarJWT,
        esVeterinario,
        check('id', 'id no es un ID válido').isMongoId(),
        check('datos', 'Los datos son obligatorios').not().isEmpty(),
        validarCampos
    ]
    , ExamenPut);


// VETERINARIO - Obtener mas informacion del examen, mascota y usuario
router.get('/informacion/:idExamen', //Pendiente o Completado
    [
        validarJWT,
        // esVeterinario,        
        validarCampos
    ]
    , MasInfoExamenGet);

router.delete('/:idExamen',
    [
        check('idExamen', 'id no es un ID válido').isMongoId(),
        validarJWT,
        validarCampos
    ],
    examenDelete);

module.exports = router;