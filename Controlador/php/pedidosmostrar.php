<?php
include_once("../../Modelo/php/BD.php");
$conexion = new BD("bonAppetit", "admin", "1234");
$solicitudes = array();
// ARMAMOS LA QUERY
$sql = "SELECT solicitudes.id, solicitudes.descripcion AS nombre_pedido, solicitudes.fecha, solicitudes.cantidad, solicitudes.unidades, usuarios.nombre AS nombre_usuario
        FROM solicitudes
        INNER JOIN usuarios  ON solicitudes.fk_usuario = usuarios.id";
$resultado = $conexion->realizarConsulta($sql);
foreach ($resultado as $fila) {
    $solicitud = array(
        "id" => $fila["id"],
        "fecha" => $fila["fecha"],
        "nombre_pedido" => $fila["nombre_pedido"],
        "cantidad" => $fila["cantidad"],
        "unidad" => $fila["unidades"],
        "nombre_usuario" => $fila["nombre_usuario"]
    );
    array_push($solicitudes, $solicitud);
}
// Devolvemos codificada la colección de las solicitudes
echo json_encode($solicitudes);
unset($conexion);
?>
