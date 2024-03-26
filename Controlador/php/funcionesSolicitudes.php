<?php
include_once("../../Modelo/php/BD.php");
session_start();

if (isset($_POST["datos"])) {
    addSolicitud();
}
if (isset($_POST["carga"])) {
    mostrarSolicitudes();
}

if (isset($_POST["eliminarSolicitud"])) {
    eliminarSolicitud();
}

if (isset($_POST["addPedido"])) {
    print_r($_POST["addPedido"]);
    addPedido($_POST["addPedido"]);
}

function addSolicitud()
{
    $datos = $_POST["datos"];
    // $correo = $datos[0]; // Obtener el correo del primer elemento
    print_r($datos);
    // Iterar sobre los elementos restantes de $datos
    $conexion = new BD();

    for ($i = 0; $i < count($datos); $i++) {
        $solicitud = $datos[$i]; // Obtener la información de la solicitud actual
        $desc = $solicitud[0]; // Descripción de la solicitud
        $cantidad = $solicitud[1]; // Cantidad de la solicitud
        $unidad = $solicitud[2]; // Unidad de la solicitud
        $observacion = $solicitud[3]; //recoger el comentario

        //Recoger dato de usuario (email) desde el session
        $correo = $_SESSION['email'];
        $idUsuario = idUsuario($correo, $conexion);
        $sqlInsertar = "INSERT into solicitudes (fecha, descripcion, unidades, cantidad, observaciones, fk_usuario) 
            values (CONCAT(YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(DAY(NOW()), 2, '0')), '$desc', '$unidad', $cantidad, '$observacion', $idUsuario)";
        echo $sqlInsertar;
        $conexion->realizarModificacion($sqlInsertar);
        // Llamar a la función addSolicitud con los datos actuales
    }

    unset($conexion);
}

function idUsuario($correo, $conexion)
{
    $sqlIDUsuario = "SELECT id FROM usuarios WHERE email LIKE '$correo'";
    $resultadoConsulta = $conexion->realizarConsulta($sqlIDUsuario);
    $IDUsuario = $resultadoConsulta->fetch();
    $IDUsuario = $IDUsuario[0];
    return $IDUsuario;
}
function idUsuarioNombre($nombre, $conexion)
{
    $sqlIDUsuario = "SELECT id FROM usuarios WHERE nombre LIKE '$nombre'";
    $resultadoConsulta = $conexion->realizarConsulta($sqlIDUsuario);
    $IDUsuario = $resultadoConsulta->fetch();
    $IDUsuario = $IDUsuario[0];
    return $IDUsuario;
}

function idProveedor($nombre, $conexion)
{
    $sqlIDProveedor = "SELECT id FROM proveedores WHERE descripcion LIKE '$nombre'";
    $resultadoConsulta = $conexion->realizarConsulta($sqlIDProveedor);
    $IDProveedor = $resultadoConsulta->fetch();
    $IDProveedor = $IDProveedor[0];
    return $IDProveedor;
}

function mostrarSolicitudes()
{
    $conexion = new BD();
    $sqlSolicitudes = "SELECT solicitudes.id AS solicitud_id, descripcion, unidades, cantidad, usuarios.nombre AS usuario_nombre
                    FROM solicitudes
                    JOIN usuarios ON solicitudes.fk_usuario = usuarios.id where tramitado=0 order by solicitudes.descripcion asc;";
    $resultadoConsulta = $conexion->realizarConsulta($sqlSolicitudes);
    $resultado = []; // Crear un nuevo array para almacenar los resultados
    while ($fila = $resultadoConsulta->fetch()) {
        $solicitud = [
            "id" => $fila["solicitud_id"],
            "descripcion" => $fila["descripcion"],
            "unidades" => $fila["unidades"],
            "cantidad" => $fila["cantidad"],
            "usuario" => $fila["usuario_nombre"]
        ];
        array_push($resultado, $solicitud);
    }
    echo json_encode($resultado, JSON_UNESCAPED_UNICODE);
    unset($conexion);

}

function eliminarSolicitud()
{
    $conexion = new BD();
    $idSolicitud = $_POST["eliminarSolicitud"];
    $sqlEliminar = "UPDATE solicitudes SET tramitado=1 WHERE id=$idSolicitud";
    $conexion->realizarModificacion($sqlEliminar);
    unset($conexion);
}

function addPedido($datos)
{
    print_r($datos);
    $conexion = new BD();
    foreach ($datos as $dato) {
        $idUsuario = idUsuarioNombre($dato[5], $conexion);
        $observaciones = $dato[4];
        $idProveedor = idProveedor($dato[3], $conexion);
        $sqlInsertarPedido = "INSERT into pedidos (fecha, fk_estado, fk_usuario, fk_proveedor, observaciones ) 
                values (CONCAT(YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(DAY(NOW()), 2, '0')), 1, $idUsuario, $idProveedor, '$observaciones')";
        $conexion->realizarModificacion($sqlInsertarPedido);

        $nombre = $dato[0];
        $cantidad = $dato[1];
        $unidad = $dato[2];
        $sqlInsertarLineaPedido = "INSERT into linea_pedido (fk_pedido, descripcion, cantidad, unidades, observaciones ) 
                values ((select max(id) from pedidos), '$nombre', $cantidad, '$unidad','$observaciones')";
        $conexion->realizarModificacion($sqlInsertarLineaPedido);

        $idSolicitud = $dato[6];
        $sqlTramitados = "UPDATE solicitudes SET tramitado=1 WHERE id=$idSolicitud";
        $conexion->realizarModificacion($sqlTramitados);

    
        $resultado = $conexion->realizarConsulta("SELECT distinct residuos.descripcion, productos_residuo.cantidad as cantidad from linea_pedido join productos on linea_pedido.descripcion = productos.descripcion
        join productos_residuo on productos.id = productos_residuo.fk_producto join residuos on 
        productos_residuo.fk_residuo = residuos.id where linea_pedido.descripcion = '$nombre';");

      
        while ($registro = $resultado->fetch()) {
            $cantidadTotal = $registro[1] * $cantidad;
            $conexion->realizarModificacion("INSERT into residuos_generados(descripcion, unidades, cantidad, fecha_creacion) values ('$registro[0]', 'Kg', $cantidadTotal, CONCAT(YEAR(NOW()), '-', LPAD(MONTH(NOW()), 2, '0'), '-', LPAD(DAY(NOW()), 2, '0')))");
        }
    }
    unset($conexion);
}