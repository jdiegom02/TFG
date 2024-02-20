<?php
include_once("../../Modelo/php/BD.php");

// Crear una instancia de la clase BD
$conexion = new BD("bonAppetit", "admin", "1234");

// Array para almacenar los usuarios
$usuarios = array();

// Consulta SQL para obtener los usuarios
$sql = "SELECT esAdmin, nombre, email, activo, telefono FROM usuarios";
$resultado = $conexion->realizarConsulta($sql);

// Verifica si hay resultados de la consulta
if ($resultado) {
    // Recorre cada fila de resultados
    foreach ($resultado as $fila) {
        // Agrega cada fila al array de usuarios
        $usuario = array(
            "esAdmin" => $fila["esAdmin"] == 1 ? 'Sí' : 'No',
            "nombre" => $fila["nombre"],
            "email" => $fila["email"],
            "activo" => $fila["activo"] == 1 ? 'Sí' : 'No',
            "telefono" => $fila["telefono"]
        );
        array_push($usuarios, $usuario);
    }
}

// Devolvemos codificada la colección de usuarios en formato JSON
echo json_encode($usuarios);

// Cerrar la conexión
unset($conexion);
?>
