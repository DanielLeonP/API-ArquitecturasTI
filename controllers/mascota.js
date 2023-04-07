const { response, request } = require('express');
const Mascota = require('../models/mascota');

const MascotaPost = async (req = request, res = response) => {

    const { nombre, idUsuario, especie, raza, sexo, MVZ, edad, castrado } = req.body;
    const fechaRegistro = Date.now()
    const mascota = new Mascota({ fechaRegistro, nombre, idUsuario, especie, raza, sexo, MVZ, edad, castrado });

    // Guardar en DB
    await mascota.save();//Almacena el usuario en la BD

    res.status(201);
    res.json({ 'msg': 'POST Resgistro de Mascota', mascota });
}



const MascotaGet = async (req = request, res = response) => {
    const { id } = req.params;
    const mascota = await Mascota.findById(id);

    res.status(200);
    res.json({ 'msg': 'GET mascoya por id', mascota });
}

const MascotasByUserGet = async (req = request, res = response) => {
    const { id } = req.params;

    const { limit = 20, desde = 0 } = req.query;

    const query = { idUsuario: id };

    const [total, mascota] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Mascota.countDocuments(query), //Cantidad de registros en BD
        Mascota.find(query)//Se pueden enviar condiciones
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.status(200);
    res.json({ 'msg': 'GET mascotas de un usuario', total, mascota });
}
// const userDelete = async (req = request, res = response) => {
//     const { id } = req.params;

//     const user = await User.findByIdAndUpdate(id, { estado: false });

//     res.json({ 'msg': 'DELETE api', user });//, userAuth 
// }

// const userPut = async (req = request, res = response) => {
//     const { id } = req.params;
//     const { _id, password, google, correo, ...resto } = req.body;

//     // Validar contra db
//     if (password) {
//         // Encriptar la contraseña
//         const salt = bcryptjs.genSaltSync(); //10 esta por defecto
//         resto.password = bcryptjs.hashSync(password, salt);

//     }
//     const user = await User.findByIdAndUpdate(id, resto, { new: true });

//     res.status(200);
//     res.json({ 'msg': 'PUT api', user });
// }

module.exports = {
    MascotaPost,
    MascotaGet,
    MascotasByUserGet,
    // userDelete,
    // userPatch,
    // userPut
}