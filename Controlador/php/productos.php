<?php
include_once("../../Modelo/php/BD.php");
$productos = array();
$sql = "select * from productos";   // Consulta básica SQL con todos los alumnos
// Comprobamos si se ha indicado algún parámetro
if (
    isset($_POST["inProducto"])
) {
    // Si se ha indicado algún parámetro actualizaremos la consulta SQL
    $sql .= " WHERE ";
    $masDeUna = FALSE;      // masDeUna es una bandera para indicar si se ha añadido algún parámetro previamente y por tanto añadir un AND antes del nuevo elemento que añadamos a la consulta
    if (isset($_POST["inProducto"])) {
        $masDeUna = TRUE;
        $sql .= "descripcion LIKE '" . $_POST["inProducto"] . "'";
    }
}
try {
    $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
    $conexion = new PDO('mysql:host=' . $servidor . ';dbname=' . $basedatos, $usuario, $password, $opciones);
    //Configura el nivel de error
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $p) {
    echo "<p>Error al conectar " . $p->getMessage() . "</p>";
    exit();
}

try {
    // Para cada fila recibida generaremos una instancia de Alumno, le asignaremos sus datos y lo añadiremos al array de salida.
    foreach ($conexion->query($sql) as $fila) {
        $producto = new Producto($fila["id"], $fila["descripcion"], $fila["fk_unidades"], $fila["observaciones"]);
        array_push($productos, $producto);
    }
} catch (Exception $ex) {
    throw new Exception("No se ha podido recuperar la lista: " + $ex);
} finally {
    $conexion = null;
}

// Devolvemos codificada la colección de alumnos
echo var_dump($producto);
echo json_encode($productos);
