<?php
include_once ("../../Modelo/php/BD.php");


function eliminarResiduo($producto_id, $residuo_nombre)
{
    $conexion = new BD();
    $productos = array();

    $sql = "SELECT id FROM residuos WHERE descripcion = '$residuo_nombre'";

    $resultado = $conexion->realizarConsulta($sql);

    $id_residuo = $resultado->fetch();
    $id_residuo = $id_residuo[0];

    $sql2 = "DELETE FROM productos_residuo WHERE fk_producto = '$producto_id' AND fk_residuo= '$id_residuo'";
    $resultado2 = $conexion->realizarConsulta($sql2);
    $consulta = $resultado2->fetch();
    echo json_encode($consulta);

    unset($conexion);
}



if (isset ($_POST["productoID"]))
{
    $array = $_POST["productoID"];
    $ids_array = explode('-', $array);

    $producto_id = $ids_array[0];
    $residuo_nombre = $ids_array[1];

    //echo json_encode($array);
    eliminarResiduo($producto_id, $residuo_nombre);
}
?>