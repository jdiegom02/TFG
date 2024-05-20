<?php
class BD
{

    private $conexion;

    public function __construct()
    {
        // $this->conexion = $this->realizarConexion("iesfuen2_inventario", "webBD", "W3b-.2024");
        $this->conexion = $this->realizarConexion("bonAppetit", "admin", "1234");

    }

    private function realizarConexion($bd, $usuario, $password)
    {
        try
        {
            /* 
            Si se quiere cambiar la ip de el servidor de la base de datos cambiar la
            variable 'host' con la ip deseada ej: ... host=127.0.0.1 ...
            */
            return new PDO("mysql: host=localhost; dbname=" . $bd, $usuario, $password);

            // return new PDO("mysql: host=localhost; dbname=" . $bd, $usuario, $password);
        }
        catch (PDOException)
        {
            echo ("Error en la conexión con la base de datos");
            return null;
        }
    }

    public function realizarConsulta($consulta)
    {
        try
        {
            return $this->conexion->query($consulta);
        }
        catch (PDOException $e)
        {
            return $e->getMessage();
        }
    }

    public function realizarModificacion($consulta)
    {
        try
        {
            return $this->conexion->exec($consulta);
        }
        catch (PDOException $e)
        {
            return $e->getMessage();
        }
    }

    public function comenzarTransaccion()
    {
        try
        {
            return $this->conexion->beginTransaction();
        }
        catch (PDOException $e)
        {
            return $e->getMessage();
        }
    }

    public function completarTransaccion()
    {
        try
        {
            return $this->conexion->commit();
        }
        catch (PDOException $e)
        {
            return $e->getMessage();
        }
    }

    public function revertirTransaccion()
    {
        try
        {
            return $this->conexion->rollBack();
        }
        catch (PDOException $e)
        {
            return $e->getMessage();
        }
    }

    public function anadirProducto()
    {
    }
}
