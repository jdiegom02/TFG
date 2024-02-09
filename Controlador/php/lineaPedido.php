<?php
include_once("../../Modelo/php/BD.php");
$productos = array();
$conexion = new BD("bonAppetit", "admin", "1234");

//ARMAMOS LA QUERY
$sql = "SELECT descripcion, sum(linea_pedido.cantidad) as cantidad from linea_pedido group by descripcion;";
$resultado = $conexion->realizarConsulta($sql);
foreach ($resultado as $fila) {
    // Construimos el array de productos
    $productos[$fila["descripcion"]] = $fila["cantidad"];
}
// Devolvemos codificada la colección de las categorías
echo json_encode($productos, JSON_UNESCAPED_UNICODE);
unset($conexion);
?>
