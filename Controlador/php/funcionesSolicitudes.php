<?php
include_once("../../Modelo/php/BD.php");
session_start();

if (isset($_POST["datos"])) {
    $datos = $_POST["datos"];
    // $correo = $datos[0]; // Obtener el correo del primer elemento
    print_r($datos);
    // Iterar sobre los elementos restantes de $datos
    for ($i = 0; $i < count($datos); $i++) {
        $solicitud = $datos[$i]; // Obtener la información de la solicitud actual
        $desc = $solicitud[0]; // Descripción de la solicitud
        $cantidad = $solicitud[1]; // Cantidad de la solicitud
        $unidad = $solicitud[2]; // Unidad de la solicitud

        //Recoger dato de usuario (email) desde el session
        $correo = $_SESSION['email'];
        // Llamar a la función addSolicitud con los datos actuales
        addSolicitud($correo, $desc, $unidad, $cantidad);
    }
}

function addSolicitud($correo, $desc, $unidad, $cantidad)
{
    echo "entrando a addSolicitud";
    $conexion = new BD("bonAppetit", "admin", "1234");
    $idUsuario = idUsuario($correo, $conexion);
    $sqlInsertar = "INSERT into solicitudes (fecha, descripcion, unidades, cantidad, fk_usuario) 
        values (CONCAT(YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(DAY(NOW()), 2, '0')), '$desc', '$unidad', $cantidad, $idUsuario)";
    echo $sqlInsertar;
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
