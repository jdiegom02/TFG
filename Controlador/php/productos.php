<?php
    include_once("../../Modelo/php/BD.php");
    $productos = array();
    $conexion = new BD("bonAppetit", "admin", "1234");
        //ARMAMOS LA QUERY
        $sql = "select * from productos";  
        $resultado = $conexion->realizarConsulta($sql);
        foreach ($resultado as $fila) {
            $producto = [ "id"=> $fila["id"],"descripcion"=>$fila["descripcion"], "fk_unidades"=>$fila["fk_unidades"],"observaciones"=>$fila["observaciones"]];
            array_push($productos, $producto);
        }
    // Devolvemos codificada la colección de productos
    echo json_encode($productos);
    unset($conexion);
?>
