<?php
header('Cache-Control: no-cache, must-revalidate');

header("Content-Type: application/json");

class Producto
{
    protected $id;
    protected $descripcion;
    protected $fk_unidades;
    protected static $observaciones;
    public function __construct($id, $descripcion, $fk_unidades, $observaciones)
    {
        $this->id = $id;
        $this->id = $descripcion;
        $this->id = $fk_unidades;
        $this->id = $observaciones;
        // if ($turno == "mañana" || "Mañana" || "MAÑANA") {
        //     $this->turno = "mañana";
        //     self::$turno_maniana++;
        // } else if ($turno == "tarde " || "Tarde" || "TARDE") {
        //     $this->turno = "tarde";
        //     self::$turno_tarde++;
        // }
    }
    public function __get($atributo)
    {
        if (property_exists($this, $atributo)) {
            return $this->$atributo;
        }
    }
    public function mostrar()
    {
        echo "<table border='1'><thead><tr><th>Medico:</th><th>Edad</th><th>Turno</th></tr></thead><tbody><tr>";
        echo "<td>" . $this->nombre . "</td>";
        echo "<td>" . $this->edad . " </td>";
        echo "<td>" . $this->turno . " </td>";
        echo "</tr></tbody></table><br><br>";
    }
}
