const { Router } = require('express');
const { check } = require('express-validator');
const { userGet, userPut, userPost, userDelete, userPatch, veterinariosGet } = require('../controllers/user');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const validarCampos = require('../midlewares/validar-campos');
const { esAdminRole, tieneRole } = require('../midlewares/validar-roles');
const { validarJWT } = require('../midlewares/validarJWT');

const router = Router();

// REGISTRAR USUARIO
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser más de 6 letras').isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail(),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom(esRoleValido),
        check('correo').custom(emailExiste),
        validarCampos
    ],
    userPost);

router.get('/veterinarios',
    [
        validarJWT,
        validarCampos
    ],
    veterinariosGet);

module.exports = router;