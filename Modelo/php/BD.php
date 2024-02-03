<?php 
    class BD {
        
        private $conexion;

        public function __construct($bd, $usuario, $password) {
            $this->conexion = $this->realizarConexion($bd, $usuario, $password);
        }
        
        private function realizarConexion($bd, $usuario, $password) {
            try {
                return new PDO("mysql: host=localhost; dbname=".$bd, $usuario, $password);
            } catch (PDOException) {
                echo ("Error en la conexión con la base de datos");
                return null;
            }
        }

        public function realizarConsulta($consulta){
            try {
                return $this->conexion -> query($consulta);
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }

        public function realizarModificacion($consulta) {
            try {
                return $this->conexion -> exec($consulta);
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }

        public function comenzarTransaccion() {
            try {
                return $this->conexion -> beginTransaction();
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }

        public function completarTransaccion() {
            try {
                return $this->conexion -> commit();
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }

        public function revertirTransaccion() {
            try {
                return $this->conexion -> rollBack();
            } catch (PDOException $e) {
                return $e->getMessage();
            }
        }
    }
?>