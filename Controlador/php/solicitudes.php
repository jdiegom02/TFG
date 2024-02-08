<?php
include_once("../../Modelo/php/BD.php");
$productos = array();
$conexion = new BD("bonAppetit", "admin", "1234");
//ARMAMOS LA QUERY
$sql = "SELECT *.linea_pedido from linea_pedido join pedidos on linea_pedido.fk_pedido=pedidos.id join usuarios on pedidos.fk_usuario=usuarios.id join solicitudes on usuarios.id=solicitudes.fk_usuario;";
$resultado = $conexion->realizarConsulta($sql);
foreach ($resultado as $fila) {
    $producto = $fila["descripcion"];
    array_push($productos, $producto);
}
// Devolvemos codificada la colección de las categorias
echo json_encode($productos);
unset($conexion);

?>