const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { MascotaPost, MascotaGet, MascotasByUserGet, MascotasXEstadoGet, TodasMascotasGet, mascotaDelete } = require('../controllers/mascota');
const { existeUsuarioPorId, existeMascotaPorId } = require('../helpers/db-validators');
const { validarJWT } = require('../midlewares/validarJWT');

const router = Router();

//Ruta para registrar nueva mascota
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('especie', 'El especie es obligatorio').not().isEmpty(),
        check('raza', 'El raza es obligatorio').not().isEmpty(),
        check('sexo', 'El sexo es obligatorio').not().isEmpty(),
        check('MVZ', 'El MVZ es obligatorio').not().isEmpty(),
        check('edad', 'El edad es obligatorio').not().isEmpty(),
        check('castrado', 'El castrado es obligatorio').not().isEmpty(),
        validarCampos
    ],
    MascotaPost);

//Ruta para obtener mascota por ID
router.get('/id/:id',
    [
        validarJWT,
        check('id').custom(existeMascotaPorId),
        validarCampos
    ],
    MascotaGet);

//Ruta para obtener mascotas de un usuario
router.get('/usuario/',
    [
        validarJWT,
        validarCampos
    ],
    MascotasByUserGet);

// Ruta para obtener mascotas que tienen algun examen con estado 'Pendiente' o 'Completado'
router.get('/estado/:estado',
    [
        validarJWT,
        validarCampos
    ],
    MascotasXEstadoGet);

//Ruta para obtener mascota que tienen algun examen con estado 'Pendiente' o 'Completado', ademas de sus examenes y usuario
router.get('/',
    [
        validarJWT,
        validarCampos
    ],
    TodasMascotasGet);

// Ruta para eliminar mascota por ID
router.delete('/:idMascota',
    [
        check('idMascota', 'id no es un ID válido').isMongoId(),
        validarJWT,
        validarCampos
    ],
    mascotaDelete);

module.exports = router;