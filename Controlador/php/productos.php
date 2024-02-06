<?php
include_once("../../Modelo/php/BD.php");
$productos = array();


$opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
$conexion = new BD("bonAppetit", "admin", "1234");
//Configura el nivel de error

try {
    //ARMAMOS LA QUERY
    $sql = "select * from productos";   // Consulta básica SQL con todos los alumnos
    // Comprobamos si se ha indicado algún parámetro
    $resultado = $conexion->realizarConsulta($sql);
    // Para cada fila recibida generaremos una instancia de Alumno, le asignaremos sus datos y lo añadiremos al array de salida.
    foreach ($resultado as $fila) {
        $producto = [ "id"=> $fila["id"],"descripcion"=>$fila["descripcion"], "fk_unidades"=>$fila["fk_unidades"],"observaciones"=>$fila["observaciones"]];
        // echo $producto->id  . "---" . $producto->descripcion ."---" .$producto->fk_unidades . "---" . $producto->observaciones;
        array_push($productos, $producto);
    }
} catch (Exception $ex) {
    throw new Exception("No se ha podido recuperar la lista: " + $ex);
} finally {
    $conexion = null;
}

// Devolvemos codificada la colección de alumnos
echo json_encode($productos);
