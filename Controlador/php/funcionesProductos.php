<?php
include_once("../../Modelo/php/BD.php");



function addProducto($desc, $unidad, $categoria,$residuos)
{
    // Crear una instancia de la clase BD
    $conexion = new BD();

    // Consultar el ID de la unidad
    $sqlIDUnidad = "SELECT id FROM unidades WHERE unidad LIKE '{$unidad}'";
    $verIDUnidad = $conexion->realizarConsulta($sqlIDUnidad);
    $IDUnidadArray = $verIDUnidad->fetch(); // Obtener el ID de la unidad
    $IDUnidad = $IDUnidadArray[0];
    // Insertar el nuevo producto en la tabla de productos
    $sqlProductos = "INSERT INTO productos (descripcion, fk_unidades, observaciones) VALUES ('$desc', $IDUnidad, NULL);";
    echo $conexion->realizarModificacion($sqlProductos);

    // Obtener el ID del producto recién insertado
    $ultimoIDProducto = ultimoID($conexion);

    // Consultar el ID de la categoría
    $sqlIDCategoria = "SELECT id FROM categorias WHERE descripcion LIKE '{$categoria}'";
    $verIDCategoria = $conexion->realizarConsulta($sqlIDCategoria);
    $IDCategoria = $verIDCategoria->fetchColumn(); // Obtener el ID de la categoría

    // Insertar la relación entre producto y categoría en la tabla productos_categoria
    $sqlProductosCategoria = "INSERT INTO productos_categoria (fk_producto, fk_categoria) VALUES ('$ultimoIDProducto', '$IDCategoria')";
    $conexion->realizarModificacion($sqlProductosCategoria);


    // Insertar los residuos asociados al producto en la tabla de residuos
    
    foreach ($residuos as $residuo) {
        $kilosResiduo = $residuo['kilos'];
        $tipoResiduo = $residuo['tipo'];

        // Consultar el ID del residuo
        $sqlIDResiduo = "SELECT id FROM residuos WHERE descripcion = '{$tipoResiduo}'";
        $verIDResiduo = $conexion->realizarConsulta($sqlIDResiduo);
        $IDResiduo = $verIDResiduo->fetchColumn(); // Obtener el ID del residuo

        //echo " ID del producto : ".$ultimoIDProducto . " Tipo de residuo: " . $tipoResiduo. " Kilos de residuo: "  . $kilosResiduo. " El dato que deberia ser un numero : ".$IDResiduo;
        $sqlResiduos = "INSERT INTO productos_residuo (fk_producto, fk_residuo,cantidad) VALUES ('$ultimoIDProducto', '$IDResiduo', '$kilosResiduo')";
        $conexion->realizarModificacion($sqlResiduos);
    }




    // Cerrar la conexión después de realizar la consulta
    unset($conexion);
}
function ultimoID($conexion)
{
    $sqlmaxIDProducto = "SELECT max(id) AS max_id FROM productos";
    $verIDProducto = $conexion->realizarConsulta($sqlmaxIDProducto);
    $row = $verIDProducto->fetch(PDO::FETCH_ASSOC); // Obtener el resultado como un array asociativo
    return $row['max_id']; // Devolver el valor del ID máximo
}



if (isset($_POST["datosProducto"])) {
  
    $arrayDatos = $_POST["datosProducto"];
    
    $nombre = $arrayDatos[0];
    $categoria = $arrayDatos[1];
    $unidad = $arrayDatos[2];
    $residuos = [];

    // Construir el array de residuos
    for ($z = 0; $z < count($arrayDatos[3]); $z++) {
        $residuos[] = array(
            'kilos' => $arrayDatos[3][$z],
            'tipo' => $arrayDatos[4][$z]
        );
    }

    addProducto($nombre, $unidad, $categoria, $residuos);
    
}













?>