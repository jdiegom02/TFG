<?php
if (isset($_POST["email"]) && isset($_POST["password"])) {
    if (preg_match("/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/", $_POST["email"]) && preg_match("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/", $_POST["password"])) {
        $email = $_POST["email"];
        $password = $_POST["password"];
        $sessionIniciada = false;
        $usuario = "admin";
        $pass = "1234";
        $conexion = new PDO('mysql: host=localhost; dbname=bonAppetit', $usuario, $pass);
        if ($conexion) {
            $consulta = "SELECT email , password usuarios";
            $resultado = $conexion->query($consulta);
            echo $password;
            echo $email;
            while ($fila = $resultado->fetch()) {
                if ($fila["email"] === $email && password_verify($password, $fila["password"])) {
                    echo "Sessión Iniciada";
                    $sessionIniciadsa = true;
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
?>
