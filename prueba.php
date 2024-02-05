<?php

$sessionIniciada = false;
$usuario = "admin";
$pass = "1234";

$conexion = new PDO('mysql: host=localhost; dbname=bonappetit', $usuario, $pass);
if ($conexion) {
    echo "patata";
}
$texto = "Gonzalo163";
echo password_hash($texto, PASSWORD_DEFAULT);
