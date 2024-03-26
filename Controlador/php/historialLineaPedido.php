<?php
include_once("../../Modelo/php/BD.php");
session_start();
// obtenerHistorial($_POST["usuario"]);
$numPedido = $_POST["idPedido"];
$conexion = new BD("bonAppetit", "admin", "1234");
// $sql = "SELECT * FROM pedidos WHERE fk_usuario = (SELECT id FROM usuarios WHERE nombre = '$usuario')";
$sql = "SELECT linea_pedido.descripcion, linea_pedido.cantidad, linea_pedido.unidades, linea_pedido.observaciones FROM linea_pedido WHERE linea_pedido.fk_pedido= '$numPedido'";
//DESCOMENTAR LA SIGUIENTE LINEA SI SE TIENEN PEDIDOS EN LAS ULTIMAS 3 SEMANAS
// -- AND fecha >= DATE_SUB(CURDATE(), INTERVAL 3 WEEK)";
$lineaPedidos = array();
$resultado = $conexion->realizarConsulta($sql);
while ($fila = $resultado->fetch()) {
    $lineaPedido = [
        "cantidad" => $fila["cantidad"],
        "unidad" => $fila["unidades"],
        "descripcion" => $fila["descripcion"],
        "observaciones" => $fila["observaciones"],
    ];
    array_push($lineaPedidos, $lineaPedido);
}
echo json_encode($lineaPedidos, JSON_UNESCAPED_UNICODE);
unset($conexion);
