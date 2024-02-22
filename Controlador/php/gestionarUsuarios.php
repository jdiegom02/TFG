<?php 
    include_once("../../Modelo/php/BD.php");

    if(isset($_POST["email"]) && isset($_POST["nombre"]) && isset($_POST["telefono"])) {
        if(preg_match("/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/", $_POST["email"]) && strlen($_POST["nombre"]) > 0 && preg_match("/^\d{9}$/", $_POST["telefono"])){
            $email = $_POST["email"];
            $nombre = $_POST["nombre"];
            $telefono = $_POST["telefono"];
            $id = $_POST["id"];
            $admin;
            $activo;
            if($_POST["admin"] == "si") {
                $admin = 1;
            } else {
                $admin = 0;
            }
            if($_POST["activo"] == "si") {
                $activo = 1;
            } else {
                $activo = 0;
            }

            $conexion = new BD("bonAppetit", "admin", "1234");
            if ($conexion) {
                $resultado = $conexion->realizarModificacion("UPDATE usuarios set esAdmin = $admin, nombre = '$nombre', email = '$email', activo = $activo, telefono = '$telefono' where id = $id");
                if ($resultado > 0) {
                    echo ("editado");
                }
                
            }
            unset($conexion);
        }
    }

    if(isset($_POST["password"])) {
        if(preg_match("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/", $_POST["password"])) {
            $password = password_hash($_POST["password"],PASSWORD_BCRYPT);
            $id = $_POST["id"];
            $conexion = new BD("bonAppetit", "admin", "1234");
            if ($conexion) {
                $resultado = $conexion->realizarModificacion("UPDATE usuarios set password = '$password' where id = $id");
                if ($resultado > 0) {
                    echo ("editado");
                }
                
            }
            unset($conexion);
        }
    }

    if(isset($_POST["emailA"]) && isset($_POST["nombreA"]) && isset($_POST["telefonoA"]) && isset($_POST["passwordA"])){
        if(preg_match("/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/", $_POST["emailA"]) && strlen($_POST["nombreA"]) > 0 && preg_match("/^\d{9}$/", $_POST["telefonoA"]) && preg_match("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/", $_POST["passwordA"])){
            $conexion = new BD("bonAppetit", "admin", "1234");
            if ($conexion) {
                $existe = false;
                $email = $_POST["emailA"];
                $nombre = $_POST["nombreA"];
                $telefono = $_POST["telefonoA"];
                $password = password_hash($_POST["passwordA"], PASSWORD_BCRYPT);
                $admin;
                $activo;
                if($_POST["adminA"] == "si") {
                    $admin = 1;
                } else {
                    $admin = 0;
                }
                if($_POST["activoA"] == "si") {
                    $activo = 1;
                } else {
                    $activo = 0;
                }

                $resultado = $conexion->realizarConsulta("select email from usuarios");

                while($fila = $resultado -> fetch()) {
                    if($fila["email"] === $email) {
                        $existe = true;
                        echo "El correo introducido ya está registrado";
                        break;
                    }
                }

                if(!$existe) {
                    $resultado = $conexion->realizarModificacion("insert into usuarios (esAdmin, nombre, email, password, activo, telefono) values ($admin, '$nombre', '$email', '$password', $activo, '$telefono')");
                    if($resultado > 0) {
                        echo "Usuario añadido";
                    }    
                }
            }
            unset($conexion);
        }
    }
?>