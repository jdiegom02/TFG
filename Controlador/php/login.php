<?php 
    if(isset($_POST["email"]) && isset($_POST["password"])) {
        if (preg_match("/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/", $_POST["email"]) && preg_match("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/", $_POST["password"])) {
            $email = $_POST["email"];
            $password = $_POST["password"];
            $sessionIniciada = false;
            $usuario ="jose";
            $pass ="1234";

            $conexion = new PDO('mysql: host=localhost; dbname=fielsalud', $usuario, $pass);

            $consulta = "select Email, Clave from usuarios";
            $resultado = $conexion -> query($consulta);

            while($fila = $resultado -> fetch()) {
                if($fila["Email"] === $email && password_verify($password, $fila["Clave"])) {
                    echo "Sessión Iniciada";
                    $sessionIniciada = true;
                    break;
                } 
            }

            if(!$sessionIniciada) {
                echo("Los datos no coinciden con ningun usuario");
            }
            unset($conexion);
        }
    }
?>