<?php
include_once("../../Modelo/php/BD.php");

/* CAMBIAR A LO QUE SE RECIBA POR JS */
function addSolicitud($desc, $unidad, $cantidad, $observaciones, $correo)
{
    // Crear una instancia de la clase BD
    $conexion = new BD("bonAppetit", "admin", "1234");
    $idUsuario = idUsuario($correo, $conexion);
    $sqlInsertar = "INSERT into solicitudes (fecha, descripcion, unidades, cantidad, observaciones, fk_usuario) 
    values (CONCAT(YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(DAY(NOW()), 2, '0')), '$desc', '$unidad', '$cantidad', '$observaciones', '$idUsuario')";
    
    echo $conexion->realizarModificacion($sqlInsertar);
}

function idUsuario($correo, $conexion)
{
    $sqlIDUsuario = "SELECT id FROM usuarios WHERE email LIKE '$correo'";
    $resultadoConsulta = $conexion->realizarConsulta($sqlIDUsuario);
    $IDUsuario = $resultadoConsulta->fetch();
    $IDUsuario = $IDUsuario[0];
    return $IDUsuario;
}
echo addSolicitud("caca", "bien gorda", 5, "pero bien gorda", "admin@example.com");
?>