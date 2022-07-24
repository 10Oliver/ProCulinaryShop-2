<?php

//Modelo para el dashboard empleados
class Estadistica extends Verificador
{
    //variables generales para las operaciones Scrud

    private $identificador = null;
    private $fechaInicial = null;
    private $fechaFinal = null;

    //Métodos para validar variables y validar

    public function setIdentificador($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->identificador = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFechaInicial($valor)
    {
        if($this->validateDate($valor)) {
            $this->fechaInicial = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setFechaFinal($valor)
    {
        if ($this->validateDate($valor)) {
            $this->fechaFinal = $valor;
            return true;
        } else {
            return false;
        }
    }

    //Se crean los métodos para interactuar con la base de datos
    public function cargarOpcionesProducto()
    {
        $sql = "SELECT id_producto, nombre_producto FROM producto";
        $params = null;
        return database::multiFilas($sql, $params);
    }

    public function cargarDatos($valor)
    {

        $vector = explode(",",$valor);
        $sql = "SELECT p.nombre_producto,SUM(deo.cantidad_producto_orden) AS total FROM detalle_orden deo
        INNER JOIN producto p ON p.id_producto = deo.id_producto
        INNER JOIN orden_compra oc ON oc.id_orden_compra = deo.id_orden_compra
        WHERE oc.fecha_hora BETWEEN ? AND ? ";
        $params = array($this->fechaInicial, $this->fechaFinal);
        if (count($vector) > 0 && $vector[0] != "") {
            $sql = $sql . " AND (";
            for ($i = 0; $i < count($vector)-1; $i++) {
                $sql = $sql . "p.id_producto = ? OR ";
                array_push($params, $vector[$i]);
            }
            $sql = $sql . " p.id_producto = ?)";
            array_push($params, end($vector) );
        } else {
            $sql = $sql." AND p.id_producto = 0";
        }
        
        $sql = $sql." GROUP BY p.nombre_producto, deo.cantidad_producto_orden";
        return database::multiFilas($sql, $params);
    }
}
