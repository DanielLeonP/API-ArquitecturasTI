const { response, request } = require('express');
const Examen = require('../models/examen');

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






// const sendEmailWithPromiseWithDynamicData = async (correo, fileName, ruta) => {
//     let mailOptions = await mailOptionsForDynamicMail(correo, fileName, ruta);
//     return new Promise((resolve, reject) => {
//         createEmailTranspoter().sendMail(mailOptions, async (error, info) => {
//             if (error) {
//                 reject(error);
//             }
//             resolve(info);
//         });
//     });
// }
// const mailOptionsForDynamicMail = async (correo, fileName, ruta) => {
//     const data = await fs.readFileSync(ruta, 'utf8');
//     return {
//         from: 'Sistema de consulta de mascotas',
//         to: correo,
//         subject: 'Sistema de consulta de mascotas',
//         html: `
//             <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
//                 <tr height="200px">  
//                     <td bgcolor="" width="600px">
//                         <h1 style="color: #fff; text-align:center">Prueba envio de correo con archivo</h1>
//                     </td>
//                 </tr>
//             </table>
//         `
//         ,
//         attachments: [
//             {
//                 filename: fileName,
//                 content: data//'http://www.axmag.com/download/pdfurl-guide.pdf',//ruta,
//                 // contentType: 'application/pdf'
//                 // href: ruta
//             }
//         ]
//         // from: `"PROJECT NAME" <SENDER EMAIL ADDRESS>`, // sender address
//         // to: correo, // list of receivers
//         // subject: "Test Subject", // Subject line
//         // text: "Test Text", // plain text body
//         // html: `
//         //         <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
//         //             <tr height="200px">  
//         //                 <td bgcolor="" width="600px">
//         //                     <h1 style="color: #fff; text-align:center">Prueba envio de correo con archivo</h1>
//         //                 </td>
//         //             </tr>
//         //         </table>
//         //     `,
//         // attachments: [
//         //     {   // utf-8 string as an attachment
//         //         filename: "YOUR ATTACHMENT FILE NAME", // file name, like 'test.pdf'
//         //         href: "LINK TO THE FILE" // link to the file, like http://example.com/invoices/test.pdf 
//         //     }
//         // ]
//     };
// }
// const createEmailTranspoter = () => {
//     return nodemailer.createTransport({
//         // host: 'smtp.gmail.com', //your smtp host name
//         service: 'Gmail', // your service name
//         // port: 465,
//         // secure: true, // true for 465, false for other ports
//         auth: {
//             user: process.env.MAILUSER,
//             pass: process.env.MAILPSSWD
//         },
//         tls: {
//             rejectUnauthorized: true
//         }
//     });

// }





const EnviarMailGet = async (req = request, res = response) => {

    const { correo } = req.body;


    // AQUI SE REALIZA BUSQUEDA DEL DE PDF
    /* GENERAR UNA FORMA DE OBTENER EL NOMBRE DEL ARCHIVO PARA ENVIARLO AL USUARIO, PARA PRUEBAS ESTA EL SIG ARCHIVO:*/
    const fileName = 'prueba.pdf'

    const ruta = path.join(__dirname, `../files/${fileName}`);

    if (!fs.existsSync(ruta)) {
        res.status(200).json({ 'msg': 'NO SE ENCONTRO EL ARCHIVO', ruta });
        return;
    }


    // console.log(ruta);
    // const datos = await sendEmailWithPromiseWithDynamicData(correo, fileName, ruta);
    // res.status(200);
    // res.json({ 'msg': 'Correo enviado Correctamente', datos });

    // ENVIAR ARCHIVO

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPSSWD
        }
    });

    const data = await fs.readFile(ruta);//, 'utf8'

    let mail_options = {
        from: 'Sistema de consulta de mascotas',
        to: correo,
        subject: 'Sistema de consulta de mascotas',
        html: `
            <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
                <tr height="200px">  
                    <td bgcolor="" width="600px">
                        <h1 style="color: #fff; text-align:center">Prueba envio de correo con archivo</h1>
                    </td>
                </tr>
            </table>
        `
        ,
        attachments: [
            {
                filename: fileName,
                content: data,
                contentType: 'application/pdf'
                // href: ruta
            }
        ]
    };

    transporter.sendMail(mail_options, (error, info) => {
        if (error) {
            res.status(200);
            res.json({ 'msg': 'ERROR EN EL SERVIDOR', error });
        } else {
            res.status(200);
            res.json({ 'msg': 'Correo enviado Correctamente' });
        }
    });
}
module.exports = {
    ReporteGet,
    EnviarMailGet
}