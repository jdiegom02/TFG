<?php
include_once("../../Modelo/php/BD.php");


function anadirResiduo($residuoNuevo, $cantidad,$idProducto)
{
    
    $conexion = new BD("bonAppetit", "admin", "1234");

    $query = "SELECT id  FROM residuos  WHERE descripcion = '$residuoNuevo'";
    $resultado = $conexion->realizarConsulta($query);
    $datoCorrecto = $resultado->fetchColumn();

    
    $query_insertar_unidad = "INSERT INTO productos_residuo (fk_producto, fk_residuo, cantidad) VALUES ('$idProducto', '$datoCorrecto', '$cantidad')";
    $conexion->realizarConsulta($query_insertar_unidad);
   
    echo "El residuio se ha añadido exitosamente.";
    unset($conexion);
}



if (isset($_POST["anadirResiduo"])) {
    $array=$_POST["anadirResiduo"];

    $residuoNuevo =$array["nuevoResiduo"];
    $cantidad =$array["cantidad"];
    $idProducto =$array["idProducto"];
    anadirResiduo($residuoNuevo, $cantidad,$idProducto);
  
}













?>