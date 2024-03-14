<?php
$pass = password_hash($_POST["pass"], PASSWORD_BCRYPT);
$correo = $_POST["correo"];

include_once("../../Modelo/php/BD.php");

$conexion = new BD("bonAppetit", "admin", "1234");
$conexion->realizarModificacion("UPDATE usuarios set password='$pass' where correo like '$correo'");

?>