<?php
include_once("../../Modelo/php/BD.php");
session_start();
// obtenerHistorial($_POST["usuario"]);
$usuario = $_POST["usuario"];
$conexion = new BD("bonAppetit", "admin", "1234");
$sql = "SELECT * FROM pedidos WHERE fk_usuario = (SELECT id FROM usuarios WHERE nombre = '$usuario')";
//DESCOMENTAR LA SIGUIENTE LINEA SI SE TIENEN PEDIDOS EN LAS ULTIMAS 3 SEMANAS
// -- AND fecha >= DATE_SUB(CURDATE(), INTERVAL 3 WEEK)";
$pedidos = array();
$resultado = $conexion->realizarConsulta($sql);
while ($fila = $resultado->fetch()) {
    $pedido = [
        "id" => $fila["id"],
        "fecha" => $fila["fecha"],
        "estado" => $fila["fk_estado"],
        "usuario" => $fila["fk_usuario"],
        "proveedor" => $fila["fk_proveedor"],
        "observaciones" => $fila["observaciones"]
    ];
    array_push($pedidos, $pedido);
}
echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);
unset($conexion);
