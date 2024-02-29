<?php
include_once("../../Modelo/php/BD.php");

function modificarProducto($id, $desc, $categorias, $unidad, $residuos)
{
    // Crear una instancia de la clase BD
    $conexion = new BD("bonAppetit", "admin", "1234");
    /*echo $id;
    echo $desc;
    print_r($categorias);
    echo ($unidad);
    print_r($residuos);*/
    try {
        $conexion->comenzarTransaccion();

        // Consulta para verificar si hay solicitudes tramitadas para el producto
        $query = "SELECT COUNT(*) AS num_solicitudes_tramitadas
                  FROM solicitudes s
                  JOIN productos p ON s.descripcion = p.descripcion
                  WHERE p.id = $id
                  AND s.tramitado = 1";
        $resultado = $conexion->realizarConsulta($query);
        $datoCorrecto = $resultado->fetchColumn();

   
        if ($datoCorrecto === 0) {
            // Consulta para modificar el producto
            $query_modificacion = "UPDATE productos SET descripcion = '$desc', fk_unidades = (SELECT id FROM unidades WHERE unidad = '$unidad'), observaciones = 'Nuevas observaciones' WHERE id = $id";
            echo $query_modificacion;
            $conexion->realizarConsulta($query_modificacion);

            // Consulta para eliminar las categorías asociadas al producto
            $query_eliminar_categorias = "DELETE FROM productos_categoria WHERE fk_producto = $id";
            $conexion->realizarConsulta($query_eliminar_categorias);

            // Consulta para insertar las nuevas categorías asociadas al producto
            foreach ($categorias as $categoria) {
                $categoriaId = $conexion->realizarConsulta("SELECT id FROM categorias WHERE descripcion = '$categoria'")->fetchColumn();
                $conexion->realizarConsulta("INSERT INTO productos_categoria (fk_producto, fk_categoria) VALUES ($id, $categoriaId)");
            }

            // Consulta para eliminar los residuos asociados al producto
            $query_eliminar_residuos = "DELETE FROM productos_residuo WHERE fk_producto = $id";
            $conexion->realizarConsulta($query_eliminar_residuos);

            // Consulta para insertar los nuevos residuos asociados al producto
            foreach ($residuos as $residuo) {
                $cantidad = $residuo['cantidad'];
                $nombre_residuo = $residuo['nombre_residuo'];
                $query_insertar_residuo = "INSERT INTO productos_residuo (fk_producto, fk_residuo, cantidad) VALUES ($id, (SELECT id FROM residuos WHERE descripcion = '$nombre_residuo'), $cantidad)";
                $conexion->realizarConsulta($query_insertar_residuo);
            }

            // Confirmar la transacción
            $conexion->completarTransaccion();
            echo "El producto ha sido modificado exitosamente.";
        }
        else{ //echo " El producto tiebe asociado un pedido tramitado, no se puede modificar";

            echo $datoCorrecto;
        }
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $conexion->revertirTransaccion();
        echo $e->getMessage();
    } finally {
        // Cerrar la conexión después de realizar la consulta
        unset($conexion);
    }
}

if (isset($_POST["modificar"])) {
    $arrayDatos = $_POST["modificar"];

    // Obtener datos del formulario
    $idNuevo = $arrayDatos["idProducto"];
    $nombreNuevo = $arrayDatos["nombreProducto"];
    $unidadNuevo = $arrayDatos["unidadesProducto"];
    $categoriasNuevas = $arrayDatos["categorias"]; 
    $residuosNuevos = $arrayDatos["residuos"];



    // Llamar a la función para modificar el producto
    modificarProducto($idNuevo, $nombreNuevo, $categoriasNuevas, $unidadNuevo, $residuosNuevos);
}