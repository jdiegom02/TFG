<?php
include_once("../../Modelo/php/BD.php");


function sacarResiduos($producto_id)
{
    $conexion = new BD("bonAppetit", "admin", "1234");
    $productos = array();

    $sql = "SELECT 
                p.id AS producto_id,
                p.descripcion AS producto_nombre,
                c.id AS categoria_id,
                c.descripcion AS categoria_nombre,
                u.id AS unidad_id,
                u.unidad AS unidad_nombre,
                r.id AS residuo_id,
                r.descripcion AS residuo_nombre,
                pr.cantidad AS cantidad_residuo
            FROM 
                Productos AS p
            JOIN 
                Productos_Categoria AS pc ON p.id = pc.fk_producto
            JOIN 
                Categorias AS c ON pc.fk_categoria = c.id
            JOIN 
                Productos_Residuo AS pr ON p.id = pr.fk_producto
            JOIN 
                Residuos AS r ON pr.fk_residuo = r.id
            JOIN 
                Unidades AS u ON p.fk_unidades = u.id
            WHERE
            p.id='$producto_id'";
    
    $resultado = $conexion->realizarConsulta($sql);
    
    // Crear una entrada para el producto fuera del bucle
    $productos[$producto_id] = array(
        "producto_id" => $producto_id,
        "nombre_producto" => "",
        "categorias" => array(),
        "unidad" => "",
        "residuos" => array()
    );
    
    // Iterar sobre los resultados para llenar la información del producto
    foreach ($resultado as $fila) {
        $productos[$producto_id]["nombre_producto"] = $fila["producto_nombre"];
        $productos[$producto_id]["unidad"] = $fila["unidad_nombre"];
        
        // Agregar categorías
        $productos[$producto_id]["categorias"][$fila["categoria_id"]] = $fila["categoria_nombre"];
        
        // Agregar residuos con su cantidad
        $productos[$producto_id]["residuos"][$fila["residuo_id"]] = array(
            "nombre_residuo" => $fila["residuo_nombre"],
            "cantidad" => $fila["cantidad_residuo"]
        );
    }
    
    // Convertir el array de productos a JSON y enviarlo
    echo json_encode($productos[$producto_id]);
    
    unset($conexion);
}



if (isset($_POST["producto_id"])) {
    $producto_id = $_POST["producto_id"];
    
    
    sacarResiduos($producto_id);
}





?>
