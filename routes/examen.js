const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { ExamenPost, ExamenesByMascotaGet, ExamenesGet, ExamenPut, MasInfoExamenGet, examenDelete } = require('../controllers/examen');
const { validarJWT } = require('../midlewares/validarJWT');
const { esVeterinario } = require('../midlewares/validar-roles');

const router = Router();

// Ruta para registrar un nuevo examen
router.post('/',
    [
        validarJWT,
        check('idMascota', 'El idMascota es obligatorio').not().isEmpty(),
        check('idMascota', 'idMascota no es un ID válido').isMongoId(),
        check('tipoExamen', 'El tipoExamen es obligatorio').not().isEmpty(),
        validarCampos
    ]
    , ExamenPost);

// Ruta para obtener examenes de una mascota
router.get('/:id',
    [
        validarJWT,
        check('id', 'id no es un ID válido').isMongoId(),
        validarCampos
    ]
    , ExamenesByMascotaGet);


// Ruta para obtener todos los examenes pendientes y completados - solo para VETERINARIO
router.get('/listado/:estado', //Pendiente o Completado
    [
        validarJWT,
        esVeterinario,
        validarCampos
    ]
    , ExamenesGet);

//Ruta para dar respuesta a un examen - Solo para VETERINARIO
router.put('/:id',
    [
        validarJWT,
        esVeterinario,
        check('id', 'id no es un ID válido').isMongoId(),
        check('datos', 'Los datos son obligatorios').not().isEmpty(),
        validarCampos
    ]
    , ExamenPut);

//Ruta para obtener mas informacion del examen, mascota y usuario - Solo para VETERINARIO
router.get('/informacion/:idExamen', //Pendiente o Completado
    [
        validarJWT,
        // esVeterinario,        
        validarCampos
    ]
    , MasInfoExamenGet);

// Ruta para eliminar un examen por ID
router.delete('/:idExamen',
    [
        check('idExamen', 'id no es un ID válido').isMongoId(),
        validarJWT,
        validarCampos
    ],
    examenDelete);

module.exports = router;