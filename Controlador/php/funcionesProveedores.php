<?php
include_once("../../Modelo/php/BD.php");

if (isset($_POST["cargaProveedor"])) {
    mandarProveedores();
}

if (isset($_POST["actualizarProveedor"])) {
    actualizarProveedor($_POST["actualizarProveedor"]);
}

if (isset($_POST["addProveedor"])) {
    addProveedor($_POST["addProveedor"]);
}


function mandarProveedores()
{
    $conexion = new BD("bonAppetit", "admin", "1234");
    $proveedores = array();

    $sql = "SELECT * from proveedores";
    $resultado = $conexion->realizarConsulta($sql);
    foreach ($resultado as $fila) {
        $proveedor = array(
            "id" => $fila["id"],
            "telefono" => $fila["telefono"],
            "descripcion" => $fila["descripcion"],
            "email" => $fila["email"],
            "direccion" => $fila["direccion"],
            "observaciones" => $fila["observaciones"]
        );
        array_push($proveedores, $proveedor);
    }
    // Devolvemos codificada la colección de los proveedores
    echo json_encode($proveedores);
    unset($conexion);
}

function actualizarProveedor($datos)
{
    $id = $datos[0];
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

function addProveedor($datos)
{
    $descripcion = $datos[0];
    $direccion = $datos[1];
    $email = $datos[2];
    $telefono = $datos[3];
    $observaciones = $datos[4];
    $conexion = new BD("bonAppetit", "admin", "1234");
    $sql = "INSERT INTO proveedores (descripcion, direccion, email, telefono, observaciones) VALUES ('$descripcion', '$direccion', '$email', '$telefono', '$observaciones')";
    $conexion->realizarModificacion($sql);
    echo $sql;
    unset($conexion);
}