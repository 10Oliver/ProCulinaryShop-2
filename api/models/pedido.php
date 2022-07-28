<?php

class pedido extends Verificador
{

    /**
     * Se crean las variables globales
     */

    private $estado = null;
    private $identificador = null;
    private $buscador = null;
    private $filtro = null;
    /**
     * Se crean los método para guardar datos en la variables globales
     */

    public function setEstado($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->estado = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setFiltro($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->filtro = $valor;
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

    public function setIden($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->identificador = $valor;
            return true;
        } else {
            return false;
        }
    }


    /**
     * Funciones que se comunican con la DB
     */

    /* ---------------- Pedidos (privada)-------------------- */

    public function cargarDatos()
    {
        $sql = 'SELECT oc.id_orden_compra, c.nombre_cliente, c.direccion, oc.fecha_hora, (SELECT calcular_subtotal(oc.id_orden_compra)),
         oc.id_estado_orden, eo.estado_orden  FROM orden_compra oc
        INNER JOIN cliente c ON c.id_cliente = oc.id_cliente
        INNER JOIN estado_orden eo ON eo.id_estado_orden = oc.id_estado_orden
        GROUP BY oc.id_orden_compra, c.id_cliente, eo.id_estado_orden
        ORDER BY oc.id_orden_compra';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función que trae dos de los tres estado de un pedido

    public function cargarEstados()
    {
        $sql = 'SELECT * FROM estado_orden WHERE id_estado_orden NOT IN (3)';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función que actualiza el estado de los pedido

    public function actualizarEstados()
    {
        $sql = 'UPDATE orden_compra SET id_estado_orden = ? WHERE id_orden_compra = ?';
        $params = array($this->estado, $this->identificador);
        return database::ejecutar($sql, $params);
    }

    //Función para "eliminar" un pedido

    public function eliminarPedidos()
    {
        $sql = 'UPDATE orden_compra SET id_estado_orden = 3 WHERE id_orden_compra = ?';
        $params = array($this->identificador);
        return database::ejecutar($sql, $params);
    }

    //Función para buscar pedidos
    public function buscarPedidos()
    {
        $sql = 'SELECT oc.id_orden_compra, c.nombre_cliente, c.direccion, oc.fecha_hora, (SELECT calcular_subtotal(c.id_cliente)),
          oc.id_estado_orden, eo.estado_orden  FROM orden_compra oc
        INNER JOIN cliente c ON c.id_cliente = oc.id_cliente
        INNER JOIN estado_orden eo ON eo.id_estado_orden = oc.id_estado_orden
        WHERE (c.nombre_cliente ILIKE ? OR c.direccion ILIKE ?)
        GROUP BY oc.id_orden_compra, c.id_cliente, eo.id_estado_orden';
        $params = array($this->buscador, $this->buscador);
        switch ($this->filtro) {
            case 1:
                $sql .= ' ORDER BY c.nombre_cliente';
                break;
            case 2:
                $sql .= ' ORDER BY (SELECT calcular_subtotal(c.id_cliente))';
                break;
            case 4:
                $sql .= ' ORDER BY oc.fecha_hora';
                break;
            case 5:
                $sql .= ' ORDER BY eo.estado_orden';
                break;
            case 3:
                $sql .= ' ORDER BY (SELECT SUM(cantidad_producto_orden) FROM detalle_orden WHERE id_orden_compra = c.id_cliente)';
                break;
            default:
                $sql .= ' ORDER BY oc.id_orden_compra';
                break;
        }
        return database::multiFilas($sql, $params);
    }

    //Función que cargará el listado de producto

    public function cargarLista()
    {
        $sql = 'SELECT p.nombre_producto, p.precio, deo.cantidad_producto_orden, (cantidad_producto_orden * precio_producto_orden) as subtotal, p.imagen FROM detalle_orden deo
        INNER JOIN producto p ON p.id_producto = deo.id_producto
        WHERE id_orden_compra = ?';
        $params = array($this->identificador);
        return database::multiFilas($sql, $params);
    }


    /*---------------------- Historial (pública)---------------- */

    //función que carga los pedidos del cliente

    public function cargarPedidos()
    {
        $sql = 'SELECT id_orden_compra, fecha_hora, calcular_subtotal(id_cliente), estado_orden FROM orden_compra oc
        INNER JOIN estado_orden eo ON eo.id_estado_orden = oc.id_estado_orden
        WHERE oc.id_estado_orden NOT IN (4) AND id_cliente = ?';
        $params = array($this->identificador);
        return database::multiFilas($sql, $params);
    }

    //función para cancelar el pedido

    public function cancelarPedido()
    {
        $sql = 'UPDATE orden_compra SET id_estado_orden = 3 WHERE id_orden_compra = ?';
        $params = array($this->identificador);
        return database::ejecutar($sql, $params);
    }
}
