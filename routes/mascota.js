const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { MascotaPost, MascotaGet, MascotasByUserGet } = require('../controllers/mascota');
const { existeUsuarioPorId, existeMascotaPorId } = require('../helpers/db-validators');
const { validarJWT } = require('../midlewares/validarJWT');

const router = Router();

// REGISTRAR MASCOTA
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

// OBTENER UNA MASCOTA POR ID
router.get('/id/:id',
    [
        validarJWT,
        check('id').custom(existeMascotaPorId),
        validarCampos
    ],
    MascotaGet);

// OBTENER MASCOTAS DE UN USAURIO
router.get('/usuario/',
    [
        validarJWT,
        validarCampos
    ],
    MascotasByUserGet);


module.exports = router;