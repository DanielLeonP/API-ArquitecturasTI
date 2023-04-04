const { Router } = require('express');
const { check } = require('express-validator');


const validarCampos = require('../midlewares/validar-campos');
const { MascotaPost, MascotaGet, MascotasByUserGet } = require('../controllers/mascota');

const router = Router();

// REGISTRAR MASCOTA
router.post('/',
    [
        // validar que el usuario existe

    ],
    MascotaPost);

// OBTENER UNA MASCOTA POR ID
router.get('/:id',
    [
        // Validar si existe id de la mascota
    ],
    MascotaGet);

// OBTENER MASCOTAS DE UN USAURIO
router.get('/Usuario/:id',
    [
        // Validar si usuario existe
    ],
    MascotasByUserGet);


module.exports = router;