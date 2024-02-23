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
    echo $arrayDatos[3]."\n";
    $idNuevo = $arrayDatos[0];
    $nombreNuevo = $arrayDatos[1];
    $categoriaNuevo = $arrayDatos[2];
    $unidadNuevo = $arrayDatos[3];
    for ($i=0; $i <count($arrayDatos[4]) ; $i++) { 
        echo $arrayDatos[4][$i]."\n";
    }

    
}













?>