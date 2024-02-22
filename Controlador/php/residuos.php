<?php
include_once("../../Modelo/php/BD.php");
$conexion = new BD("bonAppetit", "admin", "1234");
$productos = array();
// ARMAMOS LA QUERY
$sql = "SELECT descripcion from residuos";
$resultado = $conexion->realizarConsulta($sql);
foreach ($resultado as $fila) {
    $producto = array(
        "descripcion" => $fila["descripcion"]
    );
    array_push($productos, $producto);
}
// Devolvemos codificada la colección de las categorias
echo json_encode($productos);
unset($conexion);
?>