<?php
include_once("../../Modelo/php/BD.php");


function modificarProducto($desc, $unidad, $categoria,$residuos)
{
    // Crear una instancia de la clase BD
    $conexion = new BD("bonAppetit", "admin", "1234");

   
    // Consulta de editar producto
    // Cerrar la conexión después de realizar la consulta
    unset($conexion);
}


if (isset($_POST["modificar"])) {
  
    $arrayDatos = $_POST["modificar"];
    
    echo $arrayDatos[0]."\n";
    echo $arrayDatos[1]."\n";
    echo $arrayDatos[2]."\n";
    $nombreNuevo = $arrayDatos[0];
    $categoriaNuevo = $arrayDatos[1];
    $unidadNuevo = $arrayDatos[2];
    for ($i=0; $i <count($arrayDatos[3]) ; $i++) { 
        echo $arrayDatos[3][$i]."\n";
    }

    
}













?>