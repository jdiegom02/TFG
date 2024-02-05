<?php
if (isset($_POST["email"]) && isset($_POST["password"])) {
    if (preg_match("/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/", $_POST["email"]) && preg_match("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/", $_POST["password"])) {
        $email = $_POST["email"];
        $password = $_POST["password"];
        $sessionIniciada = false;
        $usuario = "admin";
        $pass = "1234";
        $conexion = new PDO('mysql: host=localhost; dbname=bonappetit', $usuario, $pass);
        if ($conexion) {
            echo "patata";
        }
        $consulta = "SELECT email , password from usuarios";
        $resultado = $conexion->query($consulta);
        echo $password;
        echo $email;
        while ($fila = $resultado->fetch()) {
            echo $fila['password'];
            if ($fila["email"] === $email && password_verify($password, $fila["password"])) {

                echo "Sessión Iniciada";
                $sessionIniciada = true;
                break;
            }
        }

        if (!$sessionIniciada) {
            echo ("Los datos no coinciden con ningun usuario");
        }
        unset($conexion);
    }
}
