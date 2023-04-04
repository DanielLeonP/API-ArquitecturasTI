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
        // validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
        check('idUsuario').custom(existeUsuarioPorId),
        validarCampos
    ],
    MascotaPost);

// OBTENER UNA MASCOTA POR ID
router.get('/:id',
    [
        // validarJWT,
        check('id').custom(existeMascotaPorId),
        validarCampos
    ],
    MascotaGet);

// OBTENER MASCOTAS DE UN USAURIO
router.get('/Usuario/:id',
    [
        // validarJWT,
        check('id').custom(existeUsuarioPorId),
        validarCampos
    ],
    MascotasByUserGet);


module.exports = router;