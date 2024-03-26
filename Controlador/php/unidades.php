<?php
include_once("../../Modelo/php/BD.php");
$conexion = new BD();
$productos = array();
// ARMAMOS LA QUERY
$sql = "SELECT unidad from unidades";
$resultado = $conexion->realizarConsulta($sql);
foreach ($resultado as $fila) {
    $producto = array(
        "unidad" => $fila["unidad"]
    );
    array_push($productos, $producto);
}
// Devolvemos codificada la colección de las categorias
echo json_encode($productos);
unset($conexion);
