<?php

if (isset($_POST["email"]) && isset($_POST["password"])) {
    if (preg_match("/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/", $_POST["email"]) && preg_match("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/", $_POST["password"])) {
        include_once("../../Modelo/php/BD.php");
        $sessionIniciada = false;
        $conexion = new BD("bonAppetit", "admin", "1234");
        if ($conexion) {
            $resultado = $conexion->realizarConsulta("SELECT * from usuarios");
            while ($fila = $resultado->fetch()) {
                if ($fila["email"] === $_POST["email"] && password_verify($_POST["password"], $fila["password"]) && $fila["activo"] == 1) {
                    $sessionIniciada = true;
                    session_start();
                    $_SESSION['email'] = $_POST['email'];
                    $_SESSION["admin"] = $fila["esAdmin"];
                    $_SESSION["nombre"] = $fila["nombre"];
                    if($_SESSION["admin"] == 1) {
                        echo 1;
                    } elseif($_SESSION["admin"] == 0) {
                        echo 0;
                    }
                    break;
                }
            }
            if (!$sessionIniciada) {
                echo ("Los datos no coinciden con ningun usuario");
            }
        }
        unset($conexion);
    }
}
