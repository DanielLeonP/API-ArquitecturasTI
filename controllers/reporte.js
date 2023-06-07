const { response, request } = require('express');
const Examen = require('../models/examen');
const User = require('../models/user');
const Mascota = require('../models/mascota');

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Controler para obtener la informacion de cada examen y generar una tabla de examenes para el reporte
const ReporteGet = async (req = request, res = response) => {

    const [total, examenes] = await Promise.all([ //resp es una coleccion de 2 promesas, se desestructura en 2 arreglos
        Examen.countDocuments(), //Cantidad de registros en BD
        Examen.find().sort({ fechaRealizado: -1 })//Se pueden enviar condiciones
    ]);

    // Respuesta con el total de examenes y su informacion
    res.status(200);
    res.json({ 'msg': 'GET generar reporte', total, examenes });
}

// Controller para enviar el correo al usuario que solicita la informacion del reporte del examen (PDF)
const EnviarMailGet = async (req = request, res = response) => {
    const { id } = req.params;

    /* Verifica que el examen se encuentre en un estado completado */
    const examen = await Examen.findById(id);
    if (examen.estado == 'Pendiente') {
        return res.status(200).json({ msg: `El examen con id ${id} continua en estado Pendiente` });
    }

    // Obtener la informacion del usuario y la mascota
    const mascota = await Mascota.findById(examen.idMascota);
    const usuario = await User.findById(mascota.idUsuario);

    // Si el examen se encuentra completado, continua para obtener el archivo almacenado como PDF
    const fecha = examen.fechaRealizado;
    const idExamen = examen.idExamen;
    const carpeta = `../files/${fecha.getFullYear()}/${fecha.getMonth()}`;

    // Obtener el directorio donde se encuentra el archivo
    var nombreArchivo = `${idExamen}.pdf`;
    var rutaArchivo = path.join(__dirname, `${carpeta}/${idExamen}.pdf`);//'prueba.pdf'

    /** SINO EXISTE EL ARCHIVO SE ENVIA PRUEBA.PDF POR DEFECTO (Error que puede ocurrir en Vercel)*/
    if (!fs.existsSync(rutaArchivo)) {
        rutaArchivo = path.join(__dirname, `../files/prueba.pdf`);
        nombreArchivo = 'prueba.pdf';
    }

    // Generar configuracion del remitente del correo
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPSSWD
        }
    });

    // Obtener los datos que tiene el archivo PDF
    const data = await fs.readFileSync(rutaArchivo);

    // Configuraciones de correo
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

    // Envío de correo
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