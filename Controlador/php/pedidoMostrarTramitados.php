<?php
include_once("../../Modelo/php/BD.php");
$conexion = new BD();
$sqlProveedores = "SELECT descripcion from proveedores";
$resultado = $conexion->realizarConsulta($sqlProveedores);
$pedidos = [];
foreach ($resultado as $fila1) {
    $proveedor = $fila1[0];
    $sqlFull = "SELECT linea_pedido.descripcion, 
    SUM(linea_pedido.cantidad) AS total_cantidad, 
    proveedores.descripcion AS proveedor,
    linea_pedido.unidades
    FROM linea_pedido 
    JOIN pedidos ON linea_pedido.fk_pedido = pedidos.id 
    JOIN proveedores ON pedidos.fk_proveedor = proveedores.id
    WHERE proveedores.descripcion = '$proveedor' 
    AND WEEK(pedidos.fecha) = WEEK(NOW()) 
    GROUP BY linea_pedido.descripcion, linea_pedido.unidades;";
    $resultado = $conexion->realizarConsulta($sqlFull);
    $pedidosProveedor = []; // Crear un arreglo para los pedidos del proveedor actual
    foreach ($resultado as $fila2) {
        $pedidosProveedor[] = [
            "descripcion" => $fila2[0],
            "cantidad" => $fila2[1],
            "proveedor" => $fila2[2],
            "unidad" => $fila2[3],
        ];
    }
    // Agregar pedidos al arreglo solo si no está vacío
    if (!empty($pedidosProveedor)) {
        $pedidos[$proveedor] = $pedidosProveedor;
    }
}
// Devolvemos codificada la colección de las pedidos
echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);
unset($conexion);
?>
