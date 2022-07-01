<?php
// Modelo para comentarios


class cliente extends Verificador
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
        if($this->validateNaturalNumber($valor))
        {
            $this->idCliente = $valor;
            return true;
        }
        
    }

    public function setEstadoCliente($valor)
    {
        if($this->validateBoolean($valor))
        {
            $this->estadoCliente = $valor;
            return true;
        }else{
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

}
