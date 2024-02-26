<?php
include_once("../../Modelo/php/BD.php");
$productos = array();
$conexion = new BD("bonAppetit", "admin", "1234");
//ARMAMOS LA QUERY
$sql = "SELECT 
            distinct (p.descripcion) AS producto_descripcion, p.id AS id, u.unidad AS unidad,c.descripcion AS categoria 
        FROM productos p
        JOIN 
            unidades u ON p.fk_unidades = u.id
        JOIN 
            productos_categoria pc ON p.id = pc.fk_producto
        JOIN 
            categorias c ON pc.fk_categoria = c.id;";
$resultado = $conexion->realizarConsulta($sql);
foreach ($resultado as $fila) {
    $producto = ["id" => $fila["id"], "descripcion" => $fila["producto_descripcion"], "unidad" => $fila["unidad"], "categoria" => $fila["categoria"]];
    array_push($productos, $producto);
}
// Devolvemos codificada la colección de productos
echo json_encode($productos);
unset($conexion);
