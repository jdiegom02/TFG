<?php
$codigo = random_int(0, 99999);
$codigo = str_pad($codigo, 5, 0, STR_PAD_LEFT);
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require("../../Modelo/php/BD.php");

require './PHPMailer/PHPMailer-master/src/Exception.php';
require './PHPMailer/PHPMailer-master/src/PHPMailer.php';
require './PHPMailer/PHPMailer-master/src/SMTP.php';

// Recoge los datos del formulario
$email = "no.reply.bonappetit@gmail.com";
$destinatario = $_POST["correo"];

// $conexion = new BD();
// $conexion->realizarModificacion("UPDATE usuarios set cambioPassword= $codigo where email like '$destinatario'");
// No veo necesario guardaro en la base de datos

// Crea una instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configura el servidor SMTP de Gmail
    // Server settings                              
    $mail->CharSet = "UTF-8";
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';                       //Set the SMTP server to send through (google)
    $mail->SMTPAuth = true;                                   //Enable SMTP authentication
    $mail->Username = 'no.reply.bonappetit@gmail.com';        //Correo
    $mail->Password = 'bowi wpqu tyvs fvkh';                  //Contraseña (esta es una generada para aplicaciones, no la de la cuenta gmail)
    $mail->SMTPSecure = 'tls';                                  //Enable implicit TLS encryption
    $mail->Port = 587;


    // Configura el remitente y el destinatario
    $mail->setFrom('no.reply.bonappetit@gmail.com', 'Bonappetit');
    $mail->addAddress($destinatario, 'Destinatario');

    $mail->isHTML(true);
    $mail->Subject = 'Código de verificación: ' . $codigo;
    $mail->Body = 'Aquí tienes tu código de verificación: ' . $codigo;
    $mail->AltBody = 'Código de verificación: ' . $codigo;

    $mail->send();
    echo $codigo;
    // echo 'El mensaje se envió correctamente';
} catch (Exception $e) {
    echo "Error al enviar el mensaje: {$mail->ErrorInfo}";
}
?>