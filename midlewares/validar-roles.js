const { request, response } = require("express")

// Validar que el rol que tiene el usuario es Admin
const esAdminRole = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({ msg: 'Se quiere verificar el role sin validar el token primero' });
    }

    const { rol, nombre } = req.user;
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({ msg: `${nombre} no es administrador - No puede hacer esto` });
    }
    next();
}

// Validar que el rol que tiene el usuario es veterinario
const esVeterinario = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({ msg: 'Se quiere verificar el role sin validar el token primero' });
    }

    const { rol, nombre } = req.user;
    if (rol !== 'VETERINARIO_ROLE') {
        return res.status(401).json({ msg: `${nombre} no es VETERINARIO_ROLE - No puede hacer esto` });
    }
    next();
}

// Validar el rol del usuario
const tieneRole = (...roles) => { //Operador rest (...)
    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({ msg: 'Se quiere verificar el role sin validar el token primero' });
        }
        if (!roles.includes(req.user.rol)) {
            return res.status(401).json({ msg: `El servicio requiere uno de estos roles ${roles}` });
        }
        console.log(roles);
        next();
    }
}
module.exports = {
    esAdminRole,
    tieneRole,
    esVeterinario
}