<?php
include_once("../../Modelo/php/BD.php");


function anadirResiduo($residuoNuevo, $cantidad)
{
    
    $conexion = new BD("bonAppetit", "admin", "1234");

    $query = "SELECT id  FROM residuos  WHERE descripcion = '$residuoNuevo'";
    $resultado = $conexion->realizarConsulta($query);
    echo $datoCorrecto = $resultado->fetchColumn();

    /*
    $query_insertar_unidad = "INSERT INTO productos_residuos (unidad, observaciones) VALUES ('$unidad', '$observaciones')";
    $conexion->realizarConsulta($query_insertar_unidad);*/
   
   // echo "La Unidad ha sido añadida exitosamente.";
    unset($conexion);
}



if (isset($_POST["anadirResiduo"])) {
    $array=$_POST["anadirResiduo"];

    $residuoNuevo =$array["nuevoResiduo"];
    $cantidad =$array["cantidad"];
    // echo $residuoNuevo;
    // echo $cantidad;

    anadirResiduo($residuoNuevo, $cantidad);
  
}













?>