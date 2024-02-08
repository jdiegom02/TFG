<?php
include_once("../../Modelo/php/BD.php");
$productos = array();
$conexion = new BD("bonAppetit", "admin", "1234");
//ARMAMOS LA QUERY
$sql = "SELECT descripcion from categorias ";
$resultado = $conexion->realizarConsulta($sql);
foreach ($resultado as $fila) {
    $producto = $fila["descripcion"];
    array_push($productos, $producto);
}
// Devolvemos codificada la colección de las categorias
echo json_encode($productos);
unset($conexion);
