<?php

include_once("../../Modelo/php/BD.php");
session_start();
if (isset($_POST["mes"]) && isset($_POST["anio"])) {
    $datos = [];
    $mes = $_POST["mes"];
    $anio = $_POST["anio"];
    $conexion = new BD();
    $resultado = $conexion->realizarConsulta("SELECT descripcion, cantidad from residuos_generados where fecha_creacion between '$anio-$mes-01' and LAST_DAY('$anio-$mes-01');");

    while ($registro = $resultado->fetch()) {
        $datos[$registro[0]] = $registro[1];
    }
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
}

if (isset($_POST["pedido"])) {
    $datos = [];
    $proveedor= $_POST["pedido"];
    $pedido = $_POST["pedido"];
    $conexion = new BD();
    $resultado = $conexion->realizarConsulta("SELECT linea_pedido.descripcion , linea_pedido.cantidad, pedidos.fecha, proveedores.descripcion 
    from linea_pedido join pedidos on linea_pedido.fk_pedido=pedidos.id join proveedores on pedidos.fk_proveedor=proveedores.id
    where proveedores.descripcion='$proveedor';");
}

?>