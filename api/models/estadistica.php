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

    //Función para obtener la cantidad de productos vendidos durante fechas
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

    //Función para obtener el dinero recaudado por fechas
    public function cargarDinero()
    {
        $sql = "SELECT CONCAT(TO_CHAR(fecha_hora, 'TMDay'), ' ',(EXTRACT(DAY FROM (fecha_hora))), ' de ',TO_CHAR(fecha_hora, 'TMMonth')) as fecha,
        (AVG(calcular_subtotal(id_orden_compra))) as promedio,
        SUM(calcular_subtotal(id_orden_compra)) AS dinero FROM orden_compra
        WHERE fecha_hora BETWEEN ? AND ?
        GROUP BY fecha_hora";
        $params = array($this->fechaInicial, $this->fechaFinal);
        return database::multiFilas($sql, $params);
    }

    //Función para obtener los clientes con más compras
    public function cargarCliente()
    {
        $sql = "SELECT CONCAT(c.nombre_cliente, ' ' , c.apellido_cliente) as nombre, SUM(calcular_subtotal(id_orden_compra)) as total  FROM orden_compra oc
        INNER JOIN cliente c ON c.id_cliente = oc.id_cliente
        WHERE oc.fecha_hora BETWEEN (CURRENT_DATE-'30 days'::INTERVAL) AND CURRENT_DATE 
        GROUP BY c.id_cliente LIMIT 5";
        $params = null;
        return database::multiFilas($sql, $params);
    }
}
