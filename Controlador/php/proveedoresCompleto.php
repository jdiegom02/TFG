<?php
include_once("../../Modelo/php/BD.php");
$conexion = new BD("bonAppetit", "admin", "1234");
$productos = array();
// ARMAMOS LA QUERY
$sql = "SELECT * from proveedores";
$resultado = $conexion->realizarConsulta($sql);
foreach ($resultado as $fila) {
    $producto = array(
        "id" => $fila["id"],
        "telefono" => $fila["telefono"],
        "descripcion" => $fila["descripcion"],
        "email" => $fila["email"],
        "direccion" => $fila["direccion"],
        "observaciones" => $fila["observaciones"]
    );
    array_push($productos, $producto);
}
// Devolvemos codificada la colección de las categorias
echo json_encode($productos);
unset($conexion);
