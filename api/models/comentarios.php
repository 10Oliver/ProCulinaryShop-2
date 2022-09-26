<?php
// Modelo para comentarios


class Comentarios extends Verificador
{

    /*
    * Declaración de variables globales para el modelo
    */

    private $textoComentario = null;
    private $valoracionComentario = null;
    private $idComentario = null;
    private $estadoComentario = null;
    private $idDetalleOrden = null;
    private $idCliente = null;
    private $fecha = null;


    /*
    * Métodos para guardar datos en las variables globales
    */

    public function setTextoComentario($texto)
    {
        if ($this->validateString($texto, 2, 400)) {
            $this->textoComentario = $texto;
            return true;
        } else {
            return false;
        }
    }


    public function setFecha($valor)
    {
        if ($this->validateDate($valor)) {
            $this->fecha = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setValoracionComentario($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->valoracionComentario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setIdComentario($id)
    {
        if ($this->validateNaturalNumber($id)) {
            $this->idComentario = $id;
            return true;
        } else {
            return false;
        }
    }

    public function setIdCliente($id)
    {
        if ($this->validateNaturalNumber($id)) {
            $this->idCliente = $id;
            return true;
        } else {
            return false;
        }
    }


    public function setEstadoComentario($estado)
    {
        if ($this->estadoComentario = $estado) {
            return true;
        } else {
            return false;
        }
    }

    public function setIdDetalleOrden($idDetalle)
    {
        if ($this->validateNaturalNumber($idDetalle)) {
            $this->idDetalleOrden = $idDetalle;
            return true;
        } else {
            return false;
        }
    }


    /*
    * Métodos para realizar los SCRUDS
    */

    //Método para obtener los comentarios por páginas

    public function cargarComentarios()
    {
        $sql = 'SELECT r.id_resena, c.nombre_cliente, c.correo_cliente, p.nombre_producto, r.resena, r.calificacion, r.id_estado_resena 
        FROM resena r 
        INNER JOIN detalle_orden deo ON r.id_detalle_orden = deo.id_detalle_orden
        INNER JOIN producto p ON p.id_producto = deo.id_producto
        INNER JOIN orden_compra oc ON deo.id_orden_compra = oc.id_orden_compra
        INNER JOIN cliente c ON c.id_cliente = oc.id_cliente
        ORDER BY r.id_resena';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función que cambiará el estado de un comentario
    public function cambiarEstado()
    {
        $sql = 'UPDATE resena SET id_estado_resena = ? WHERE id_resena = ?';
        $params = array($this->estadoComentario, $this->idComentario);
        return database::ejecutar($sql, $params);
    }

    // Función que creará un comentario (pública)
    public function crearComentario()
    {
        $sql = 'INSERT INTO resena (resena,calificacion,fecha_resena,id_estado_resena,id_detalle_orden)
        VALUES (?,?,?,?,?)';
        $params = null;
    }
    //Función para buscar comentarios

    public function buscar($buscador)
    {

        $sql = 'SELECT r.id_resena, c.nombre_cliente, c.correo_cliente, p.nombre_producto, r.resena, r.calificacion, r.id_estado_resena FROM resena r 
        INNER JOIN detalle_orden deo ON r.id_detalle_orden = deo.id_detalle_orden
        INNER JOIN producto p ON p.id_producto = deo.id_producto
        INNER JOIN orden_compra oc ON deo.id_orden_compra = oc.id_orden_compra
        INNER JOIN cliente c ON c.id_cliente = oc.id_cliente
		WHERE c.nombre_cliente ILIKE ? OR p.nombre_producto ILIKE ? OR resena ILIKE ?';
        $params = array("%$buscador%", "%$buscador%", "%$buscador%");
        return database::multiFilas($sql, $params);
    }


    //-------------- Funciones para la vista pública---------------------\\

    public function obtenerProductos()
    {
        $sql = 'SELECT deo.id_detalle_orden, nombre_producto, imagen FROM producto p
        INNER JOIN detalle_orden deo ON p.id_producto = deo.id_producto
        INNER JOIN orden_compra oc ON deo.id_orden_compra = oc.id_orden_compra
        WHERE deo.id_orden_compra = (SELECT id_orden_compra FROM orden_compra LIMIT 1 OFFSET ((SELECT COUNT(id_orden_compra) FROM orden_compra)-1))
        AND oc.id_estado_orden = 2 AND oc.id_cliente = ?';
        $params = array($this->idCliente);
        return database::multiFilas($sql, $params);
    }


    //Función para guardar las valoraciones

    public function guardarValoracion()
    {
        $sql = 'INSERT INTO resena (resena, calificacion, fecha_resena, id_estado_resena, id_detalle_orden)
        VALUES (?,?,?,?,?)';
        $params = array($this->textoComentario, $this->valoracionComentario, date('m-d-Y', time()), 1, $this->idDetalleOrden);
        return database::ejecutar($sql, $params);
    }
}
