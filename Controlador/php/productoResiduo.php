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
    $producto = array(
         "producto_id" => $fila["producto_id"],
        "nombre_producto" => $fila["producto_nombre"],
        "categoria" => $fila["categoria_nombre"],
        "unidad" => $fila["unidad_nombre"],
        "residuos" => $fila["residuo_nombre"]
    );
    array_push($productos, $producto);

}
echo json_encode($productos);

unset($conexion);
?>
