<?php
include_once("../../Modelo/php/BD.php");

// Obtener el mes y el año seleccionados desde la solicitud POST
$mesSeleccionado = $_POST['mes'];
$anioSeleccionado = $_POST['anio'];

// Crear la conexión a la base de datos
$conexion = new BD("bonAppetit", "admin", "1234");
$residuos = array();


$sql = "SELECT pr.id AS residuo_id, pr.fk_producto, pr.fk_residuo, pr.cantidad, pr.fecha, r.descripcion AS residuo_descripcion, p.id AS producto_id, p.descripcion AS producto_descripcion
        FROM productos_residuo pr
        INNER JOIN residuos r ON pr.fk_residuo = r.id
        INNER JOIN productos p ON pr.fk_producto = p.id
        WHERE MONTH(pr.fecha) = $mesSeleccionado AND YEAR(pr.fecha) = $anioSeleccionado";


$resultado = $conexion->realizarConsulta($sql);


foreach ($resultado as $fila) {
    $residuo = array(
        "residuo_id" => $fila["residuo_id"],
        "fk_producto" => $fila["fk_producto"],
        "fk_residuo" => $fila["fk_residuo"],
        "cantidad" => $fila["cantidad"],
        "fecha" => $fila["fecha"],
        "residuo_descripcion" => $fila["residuo_descripcion"],
        "producto_id" => $fila["producto_id"],
        "producto_descripcion" => $fila["producto_descripcion"]
    );
    array_push($residuos, $residuo);
}


echo json_encode($residuos);

// Cerrar la conexión
unset($conexion);
?>
