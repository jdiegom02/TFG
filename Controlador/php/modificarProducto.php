<?php
include_once("../../Modelo/php/BD.php");


function modificarProducto($id, $desc, $categoria, $unidad, $residuos)
{
    // Crear una instancia de la clase BD
    $conexion = new BD("bonAppetit", "admin", "1234");


    $query = "SELECT COUNT(*) AS num_solicitudes_tramitadas
              FROM solicitudes s
              JOIN productos p ON s.descripcion = p.descripcion
              WHERE p.id = $id
              AND s.tramitado = 1";
    $resultado = $conexion->realizarConsulta($query);
    
$datoCorrecto = $resultado ->fetch();
$datoCorrecto= $datoCorrecto[0];

if($datoCorrecto!==0)
{
    echo "No se puede modificar el producto porque hay solicitudes tramitadas para este producto.";
}
else if($datoCorrecto===0)
{

    $query_categoria = "SELECT id FROM categorias WHERE descripcion = '$categoria'";
        $resultado_categoria = $conexion->realizarConsulta($query_categoria);
        $categoriaId = $resultado_categoria->fetchColumn();

    
        $query_modificacion = "UPDATE productos SET descripcion = '$desc', fk_unidades = (SELECT id FROM unidades WHERE unidad = '$unidad'), observaciones = 'Nuevas observaciones' WHERE id = $id";
            $conexion->realizarConsulta($query_modificacion);

        $query_modificacion2 = "UPDATE productos_categoria SET fk_categoria = '$categoriaId' WHERE fk_producto = '$id'";
        $conexion->realizarConsulta($query_modificacion2);


            $query_eliminar_residuos = "DELETE FROM productos_residuo WHERE fk_producto = $id";
            $conexion->realizarConsulta($query_eliminar_residuos);

            foreach ($residuos as $residuo) {
                $query_insertar_residuo = "INSERT INTO productos_residuo (fk_producto, fk_residuo) VALUES ($id, (SELECT id FROM residuos WHERE descripcion = '$residuo'))";
                $conexion->realizarConsulta($query_insertar_residuo);
            }

            echo "El producto ha sido modificado exitosamente.";
}




    // Cerrar la conexión después de realizar la consulta
    unset($conexion);
}



if (isset($_POST["modificar"])) {
  
    $arrayDatos = $_POST["modificar"];
    
    echo $arrayDatos[0]."\n";
    echo $arrayDatos[1]."\n";
    echo $arrayDatos[2]."\n";
    echo $arrayDatos[3]."\n";
    $idNuevo = $arrayDatos[0];
    $nombreNuevo = $arrayDatos[1];
    $categoriaNuevo = $arrayDatos[2];
    $unidadNuevo = $arrayDatos[3];
    for ($i=0; $i <count($arrayDatos[4]) ; $i++) { 
        echo $arrayDatos[4][$i]."\n";
    }
    $idNuevo = $arrayDatos[0];
    $nombreNuevo = $arrayDatos[1];
    $categoriaNuevo = $arrayDatos[2];
    $unidadNuevo = $arrayDatos[3];
    $residuosNuevos = $arrayDatos[4];
    modificarProducto($idNuevo, $nombreNuevo, $categoriaNuevo, $unidadNuevo, $residuosNuevos);
}













?>