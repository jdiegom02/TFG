<?php
include_once("../../Modelo/php/BD.php");

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
            r.descripcion AS residuo_nombre
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
        ORDER BY 
            producto_id";

$resultado = $conexion->realizarConsulta($sql);

foreach ($resultado as $fila) {
    $producto_id = $fila["producto_id"];

    // Verificar si el producto ya existe en el array
    if (!isset($productos[$producto_id])) {
        // Si no existe, crear una entrada para el producto
        $productos[$producto_id] = array(
            "producto_id" => $producto_id,
            "nombre_producto" => $fila["producto_nombre"],
            "categorias" => array(), // Inicializar un array para las categorías
            "unidad" => $fila["unidad_nombre"],
            "residuos" => array() // Inicializar un array para los residuos
        );
    }

    // Agregar la categoría si no existe en el array de categorías del producto
    if (!in_array($fila["categoria_nombre"], $productos[$producto_id]["categorias"])) {
        $productos[$producto_id]["categorias"][] = $fila["categoria_nombre"];
    }

    // Agregar el residuo si no existe en el array de residuos del producto
    if (!in_array($fila["residuo_nombre"], $productos[$producto_id]["residuos"])) {
        $productos[$producto_id]["residuos"][] = $fila["residuo_nombre"];
    }
}

// Codificar el array de productos como JSON y enviarlo
echo json_encode(array_values($productos));

unset($conexion);
?>
