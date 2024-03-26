<?php
include_once("../../Modelo/php/BD.php");


function anadirCategoria($categoria, $observaciones)
{
    // Crear una instancia de la clase BD
    $conexion = new BD();


    $query_insertar_categoria = "INSERT INTO categorias (descripcion, observaciones) VALUES ('$categoria', '$observaciones')";
    $conexion->realizarConsulta($query_insertar_categoria);
   
    echo "La categoria ha sido añadida exitosamente.";
    unset($conexion);
}



if (isset($_POST["anadirCategoria"])) {
  
    $array = $_POST["anadirCategoria"];
   
    $nuevaCategoria= $array["categoriasNueva"];
    $observacionesNueva= $array["observaciones"];

    anadirCategoria($nuevaCategoria, $observacionesNueva);
  
}













?>