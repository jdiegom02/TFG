<?php 
    session_start();
    if(isset($_POST["sesion"])){
        session_destroy();
    }
    if (isset($_SESSION["nombre"])) {
        $respuesta = [];
        if ($_SESSION["admin"] == 1) {
            $respuesta["nombre"] = $_SESSION["nombre"];
            $respuesta["esadmin"] = true;
        } else {
            $respuesta["nombre"] = $_SESSION["nombre"];
            $respuesta["esadmin"] = false;
        }  
        echo json_encode($respuesta);
    } else {
        echo json_encode(0);
    }
?>