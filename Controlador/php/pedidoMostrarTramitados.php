<?php
include_once("../../Modelo/php/BD.php");
$conexion = new BD("bonAppetit", "admin", "1234");
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
    $pedidos[$proveedor] = []; // Inicializar un array vacío para cada proveedor
    foreach ($resultado as $fila2) {
        $pedidos[$proveedor][] = [
            "descripcion" => $fila2[0],
            "cantidad" => $fila2[1],
            "proveedor" => $fila2[2],
            "unidad" => $fila2[3],
        ];
    }
}
// print_r($pedidos);

// Devolvemos codificada la colección de las pedidos
echo json_encode($pedidos);
unset($conexion);
?>
