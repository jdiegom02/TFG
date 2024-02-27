<?php
include_once("../../Modelo/php/BD.php");


function anadirCategoria($unidad, $observaciones)
{
    // Crear una instancia de la clase BD
    $conexion = new BD("bonAppetit", "admin", "1234");


    $query_insertar_unidad = "INSERT INTO unidades (unidad, observaciones) VALUES ('$unidad', '$observaciones')";
    $conexion->realizarConsulta($query_insertar_unidad);
   
    echo "La Unidad ha sido añadida exitosamente.";
    unset($conexion);
}



if (isset($_POST["anadirUnidad"])) {
  
    $array = $_POST["anadirUnidad"];
   
    $nuevaUnidad= $array["unidadNueva"];
    $observacionesNueva= $array["observaciones"];

    anadirCategoria($nuevaUnidad, $observacionesNueva);
  
}













?>