<?php
include_once("../../Modelo/php/BD.php");

// Obtener el mes y el año seleccionados desde la solicitud POST
$mesSeleccionado = $_POST['mes'];
$anioSeleccionado = $_POST['anio'];

// Crear la conexión a la base de datos
$conexion = new BD("bonAppetit", "admin", "1234");
$residuos = array();


$sql = "SELECT pr.id AS residuo_id, pr.descripcion, pr.cantidad, pr.unidades
        FROM residuos_generados pr
        WHERE MONTH(pr.fecha_creacion) = $mesSeleccionado AND YEAR(pr.fecha_creacion) = $anioSeleccionado";


$resultado = $conexion->realizarConsulta($sql);


foreach ($resultado as $fila) {
    $residuo = array(
        "descripcion" => $fila["descripcion"],
        "cantidad" => $fila["cantidad"],
        "unidad" => $fila["unidades"],
    );
    array_push($residuos, $residuo);
}


echo json_encode($residuos);

// Cerrar la conexión
unset($conexion);
?>
