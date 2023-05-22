const { response, request } = require('express');
const Examen = require('../models/examen');
const User = require('../models/user');
const Mascota = require('../models/mascota');

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ReporteGet = async (req = request, res = response) => {

    const [total, examenes] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Examen.countDocuments(), //Cantidad de registros en BD
        Examen.find()//Se pueden enviar condiciones
    ]);



    /*AQUI SE REALIZA LA TABLA DONDE CONTIENE TODOS Y CADA UNO DE LOS EXAMENES REALIZADOS*/


    res.status(200);
    res.json({ 'msg': 'GET generar reporte', total, examenes });
}

const EnviarMailGet = async (req = request, res = response) => {
    const { id } = req.params;

    // AQUI SE REALIZA BUSQUEDA DEL DE PDF

    /* Verifica que el examen se encuentre en un estado completado */
    const examen = await Examen.findById(id);
    if (examen.estado == 'Pendiente') {
        return res.status(200).json({ msg: `El examen con id ${id} continua en estado Pendiente` });
    }
    const mascota = await Mascota.findById(examen.idMascota);
    const usuario = await User.findById(mascota.idUsuario);

    /** Si esta completado, se envia */
    // console.log(examen);
    const fecha = examen.fechaRealizado;
    const idExamen = examen.idExamen;
    const carpeta = `../files/${fecha.getFullYear()}/${fecha.getMonth()}`;

    /* OBTENER NOMBRE DE ARCHIVO:*/
    var nombreArchivo = `${idExamen}.pdf`;
    var rutaArchivo = path.join(__dirname, `${carpeta}/${idExamen}.pdf`);//'prueba.pdf'

    /** SINO EXISTE EL ARCHIVO SE ENVIA PRUEBA.PDF POR DEFECTO */
    if (!fs.existsSync(rutaArchivo)) {
        rutaArchivo = path.join(__dirname, `../files/prueba.pdf`);
        nombreArchivo = 'prueba.pdf';
    }

    // ENVIAR ARCHIVO
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPSSWD
        }
    });

    const data = await fs.readFileSync(rutaArchivo);

    let mail_options = {
        from: 'Sistema de consulta de mascotas',
        to: usuario.correo,
        subject: 'Sistema de consulta de mascotas',
        html: `
            <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
                <tr height="200px">  
                    <td bgcolor="" width="600px">
                        <h1 style="color: #fff; text-align:center">Notificación de examen con id de seguimiento '${examen._id}'</h1>
                    </td>
                </tr>
            </table>
        `
        ,
        attachments: [
            {
                filename: nombreArchivo,
                content: data,
            }
        ]
    };

    transporter.sendMail(mail_options, (error, info) => {
        if (error) {
            res.status(200);
            res.json({ 'msg': 'ERROR EN EL SERVIDOR', error });
        } else {
            res.status(200);
            res.json({ 'msg': 'Correo enviado Correctamente', rutaArchivo });
        }
    });
}
module.exports = {
    ReporteGet,
    EnviarMailGet
}