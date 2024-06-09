<?php
include_once("../../Modelo/php/BD.php");

function modificarProducto($id, $desc, $categorias, $unidad, $residuos)
{
    $conexion = new BD();
    try {
        $conexion->comenzarTransaccion();

        //Verificar si hay solicitudes tramitadas para el producto
        $query = "SELECT COUNT(*) AS num_solicitudes_tramitadas
                  FROM solicitudes s
                  JOIN productos p ON s.descripcion = p.descripcion
                  WHERE p.id = $id
                  AND s.tramitado = 1";
        $resultado = $conexion->realizarConsulta($query);
        $datoCorrecto = $resultado->fetchColumn();

        if ($datoCorrecto == 0) {
            //Modificar producto
            $query_modificacion = "UPDATE productos SET descripcion = '$desc', fk_unidades = (SELECT id FROM unidades WHERE unidad = '$unidad'), observaciones = 'Nuevas observaciones' WHERE id = $id";
            $conexion->realizarConsulta($query_modificacion);

            //Eliminar las categorías asociadas al producto 
            $query_eliminar_categorias = "DELETE FROM productos_categoria WHERE fk_producto = $id";
            $conexion->realizarConsulta($query_eliminar_categorias);

            foreach ($categorias as $categoria) {
                $categoriaId = $conexion->realizarConsulta("SELECT id FROM categorias WHERE descripcion = '$categoria'")->fetchColumn();
                $conexion->realizarConsulta("INSERT INTO productos_categoria (fk_producto, fk_categoria) VALUES ($id, $categoriaId)");
            }
            //verificar si hay residuos en la lista antes de eliminar
            if (!empty($residuos)) {
                $query_eliminar_residuos = "DELETE FROM productos_residuo WHERE fk_producto = $id";
                $conexion->realizarConsulta($query_eliminar_residuos);

                foreach ($residuos as $residuo) {
                    $cantidad = $residuo['cantidad'];
                    $nombre_residuo = $residuo['nombre_residuo'];
                    $residuoId = $conexion->realizarConsulta("SELECT id FROM residuos WHERE descripcion = '$nombre_residuo'")->fetchColumn();
                    $query_insertar_residuo = "INSERT INTO productos_residuo (fk_producto, fk_residuo, cantidad) VALUES ($id, $residuoId, $cantidad)";
                    $conexion->realizarConsulta($query_insertar_residuo);
                }
            }

            // Todo bien
            $conexion->completarTransaccion();
            echo "El producto ha sido modificado exitosamente.";
        } else {
            echo "1";
        }
    } catch (Exception $e) {
        //Revertir y no hacer nada, mandar mensaje response 1 para el modal
        $conexion->revertirTransaccion();
        echo "1";
    } finally {
        // Cerrar conexion
        unset($conexion);
    }
}

if (isset($_POST["modificar"])) {
    $arrayDatos = $_POST["modificar"];

    // Obtener datos
    $idNuevo = $arrayDatos["idProducto"];
    $nombreNuevo = $arrayDatos["nombreProducto"];
    $unidadNuevo = $arrayDatos["unidadesProducto"];
    $categoriasNuevas = $arrayDatos["categorias"];
    $residuosNuevos = $arrayDatos["residuos"];

    modificarProducto($idNuevo, $nombreNuevo, $categoriasNuevas, $unidadNuevo, $residuosNuevos);
}
?>
