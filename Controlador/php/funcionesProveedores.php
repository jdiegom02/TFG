<?php
include_once("../../Modelo/php/BD.php");

if (isset($_POST["cargaProveedor"])) {
    mandarProveedores();
}

if (isset($_POST["actualizarProveedor"])) {
    actualizarProveedor($_POST["actualizarProveedor"]);
}

function mandarProveedores()
{
    $conexion = new BD("bonAppetit", "admin", "1234");
    $productos = array();

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
    // Devolvemos codificada la colección de los proveedores
    echo json_encode($productos);
    unset($conexion);
}

function actualizarProveedor($datos){
    print_r($datos);
    $id= $datos[0];
    $descripcion = $datos[1];
    $direccion = $datos[2];
    $email = $datos[3];
    $telefono = $datos[4];
    $observaciones = $datos[5];

    $conexion = new BD("bonAppetit", "admin", "1234");
    $sql = "UPDATE proveedores set descripcion='$descripcion', direccion='$direccion', email='$email', telefono='$telefono', observaciones='$observaciones' where id=$id";
    echo $sql;
    $conexion->realizarModificacion($sql);
}