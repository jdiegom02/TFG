<?php
include_once("../../Modelo/php/BD.php");

if (isset($_POST["datos"])) {
    $datos = $_POST["datos"];
    $correo = $datos[0]; // Obtener el correo del primer elemento

    // Iterar sobre los elementos restantes de $datos
    for ($i = 1; $i < count($datos); $i++) {
        $solicitud = $datos[$i]; // Obtener la información de la solicitud actual
        $desc = $solicitud[0]; // Descripción de la solicitud
        $unidad = $solicitud[1]; // Unidad de la solicitud
        $cantidad = $solicitud[2]; // Cantidad de la solicitud
        $observaciones = $solicitud[3]; // Observaciones de la solicitud

        // Llamar a la función addSolicitud con los datos actuales
        addSolicitud($correo, $desc, $unidad, $cantidad, $observaciones);
    }
}

function addSolicitud($correo, $desc, $unidad, $cantidad, $observaciones)
{
    // Crear una instancia de la clase BD
    $conexion = new BD("bonAppetit", "admin", "1234");
    $idUsuario = idUsuario($correo, $conexion);
    $sqlInsertar = "INSERT into solicitudes (fecha, descripcion, unidades, cantidad, observaciones, fk_usuario) 
    values (CONCAT(YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(DAY(NOW()), 2, '0')), '$desc', '$unidad', '$cantidad', '$observaciones', '$idUsuario')";
    
    $conexion->realizarModificacion($sqlInsertar);
}

function idUsuario($correo, $conexion)
{
    $sqlIDUsuario = "SELECT id FROM usuarios WHERE email LIKE '$correo'";
    $resultadoConsulta = $conexion->realizarConsulta($sqlIDUsuario);
    $IDUsuario = $resultadoConsulta->fetch();
    $IDUsuario = $IDUsuario[0];
    return $IDUsuario;
}
?>
