<?php
// Modelo para comentarios


class Cliente extends Verificador
{

    /*
    * Declaración de variables globales para el modelo
    */

    private $idCliente = null;
    private $estadoCliente = null;
    private $buscador = null;


    /*
    * Métodos para guardar datos en las variables globales
    */

    public function setIdCliente($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->idCliente = $valor;
            return true;
        }
    }

    public function setEstadoCliente($valor)
    {
        if ($this->validateBoolean($valor)) {
            $this->estadoCliente = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setIdComentario($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->idComentario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setBuscador($valor)
    {
        if ($this->validateAlphanumeric($valor, 0, 100)) {
            $this->buscador = "%$valor%";
            return true;
        } else {
            return false;
        }
    }


    /*
    * Métodos para realizar los SCRUDS
    */

    //Método para obtener los comentarios por páginas

    public function cargarClientes()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, usuario_cliente, estado_cliente
         FROM cliente ORDER BY id_cliente';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función para buscar usuarios en concreto

    public function buscar()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, usuario_cliente, estado_cliente
         FROM cliente WHERE (nombre_cliente || apellido_cliente ILIKE ? OR correo_cliente ILIKE ? OR usuario_cliente ILIKE ?) ORDER BY id_cliente';
        $params = array($this->buscador, $this->buscador, $this->buscador);
        return database::multiFilas($sql, $params);
    }

    //Función para actualizar el estado del cliente

    public function actualizarEstado()
    {
        $sql = 'UPDATE cliente SET estado_cliente = ? WHERE id_cliente = ?';
        $params = array($this->estadoCliente, $this->idCliente);
        return database::multiFilas($sql, $params);
    }

    //Función para generar reporte
    public function reporte()
    {
        $sql = "SELECT SUM(deo.cantidad_producto_orden) AS cantidad, ROUND(AVG(deo.precio_producto_orden),2) AS promedio,
        calcular_subtotal(oc.id_orden_compra) as total, oc.fecha_hora, 
        (SELECT nombre_producto FROM producto p
        INNER JOIN detalle_orden deo ON deo.id_producto = p.id_producto
        WHERE deo.id_orden_compra = oc.id_orden_compra
        AND deo.cantidad_producto_orden =
        (SELECT MAX(cantidad_producto_orden) FROM detalle_orden WHERE id_orden_compra = oc.id_orden_compra)
        ORDER BY deo.id_detalle_Orden LIMIT 1) AS numeroso,
        (SELECT nombre_producto FROM producto p
        INNER JOIN detalle_orden deo ON deo.id_producto = p.id_producto
        WHERE deo.id_orden_compra = oc.id_orden_compra
        AND deo.precio_producto_orden =
        (SELECT MAX(precio_producto_orden) FROM detalle_orden WHERE id_orden_compra = oc.id_orden_compra)
        ORDER BY deo.id_detalle_Orden LIMIT 1) AS caro FROM detalle_orden deo
        INNER JOIN orden_compra oc ON oc.id_orden_compra = deo.id_orden_compra
        WHERE oc.fecha_hora > CURRENT_DATE - '30 days'::INTERVAL
        AND id_cliente = ?
        GROUP BY oc.id_orden_compra
        ORDER BY oc.id_orden_compra";
        $params = array($this->idCliente);
        return database::multiFilas($sql, $params);
    }
}
