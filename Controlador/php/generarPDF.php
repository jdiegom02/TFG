<?php

include_once("../../Modelo/php/BD.php");
session_start();
$datos=[];
$mes=$_POST["mes"];
$anio=$_POST["anio"];
$conexion = new BD("bonAppetit", "admin", "1234");
$resultado = $conexion->realizarConsulta("SELECT descripcion, cantidad from residuos_generados where fecha_creacion between '$anio-$mes-01' and LAST_DAY('$anio-$mes-01');");

while ($registro = $resultado->fetch()) {
    $datos[$registro[0]] = $registro[1];
}
echo json_encode($datos, JSON_UNESCAPED_UNICODE);
?>