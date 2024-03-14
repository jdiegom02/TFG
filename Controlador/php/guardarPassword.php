<?php
$pass = password_hash($_POST["pass"], PASSWORD_BCRYPT);
$correo = $_POST["correo"];

include_once("../../Modelo/php/BD.php");

$conexion = new BD("bonAppetit", "admin", "1234");
$sql="UPDATE usuarios set password='$pass' where email like '$correo'";
echo $sql;
$conexion->realizarModificacion($sql);
echo "cucu";
?>