<?php

// Modelo para empleados

class empleado extends Verificador
{
    //Variables generales para las operaciones SCRUD
    private $identificador = null;
    private $nombreEmpleado = null;
    private $apellidoEmpleado = null;
    private $direccionEmpleado = null;
    private $duiEmpleado = null;
    private $cargoEmpleado = null;
    private $usuarioEmpleado = null;
    private $telefonoEmpleado = null;
    private $correoEmpleado = null;
    private $estadoEmpleado = null;
    private $buscador = null;
    private $categoriaEmpleado = null;


    /*
    * Métodos para asignar el valor a las variables generales
    */

    public function setIdentificador($id)
    {

        if ($this->validateNaturalNumber($id)) {
            $this->identificador = $id;
            return true;
        } else {
            return false;
        }
    }

    public function setCategoriaEmpleado($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->categoriaEmpleado = $valor;
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

    public function setNombreEmpleado($nombre)
    {
        if ($this->validateString($nombre, 5, 80)) {
            $this->nombreEmpleado = $nombre;
            return true;
        } else {
            return false;
        }
    }

    public function setApellidoEmpleado($apellido)
    {
        if ($this->validateString($apellido, 5, 80)) {
            $this->apellidoEmpleado = $apellido;
            return true;
        } else {
            return false;
        }
    }

    public function setDireccionEmpleado($direccion)
    {
        if ($this->validateString($direccion, 5, 80)) {
            $this->direccionEmpleado = $direccion;
            return true;
        } else {
            return false;
        }
    }

    public function setDuiEmpleado($dui)
    {
        if ($this->validateDUI($dui)) {
            $this->duiEmpleado = $dui;
            return true;
        } else {
            return false;
        }
    }

    public function setCargoEmpleado($cargo)
    {
        if ($this->validateNaturalNumber($cargo)) {
            $this->cargoEmpleado = $cargo;
            return true;
        } else {
            return false;
        }
    }

    public function setUsuarioEmpleado($usuario)
    {
        if ($this->validateString($usuario, 5, 80)) {
            $this->usuarioEmpleado = $usuario;
            return true;
        } else {
            return false;
        }
    }

    public function setTelefonoEmpleado($telefono)
    {
        if ($this->validateNaturalNumber($telefono)) {
            $this->telefonoEmpleado = $telefono;
            return true;
        } else {
            return false;
        }
    }

    public function setCorreoEmpleado($correo)
    {
        if ($this->correoEmpleado = $correo) {
            return true;
        } else {
            return false;
        }
    }


    public function setEstadoEmpleado($estado)
    {
        if ($this->estadoEmpleado = $estado) {
            return true;
        } else {
            return false;
        }
    }



    /*
     * Métodos para gestionar las operaciones SCRUD para los empleados
     */


    public function buscar()
    {
        $sql = "SELECT id_empleado, nombre_empleado, apellido_empleado, telefono_empleado, correo_empleado, 
         nombre_cargo FROM empleado e INNER JOIN cargo_empleado ce ON e.id_cargo_empleado=ce.id_cargo_empleado
         WHERE (nombre_empleado || ' ' ||apellido_empleado ILIKE ? OR correo_empleado ILIKE ?)";
        $params = array($this->buscador, $this->buscador);
        if ($this->categoriaEmpleado != 0) {
            $sql .= ' AND e.id_cargo_empleado = ? ';
            array_push($params, $this->categoriaEmpleado);
        }
        $sql .= ' ORDER BY id_empleado';
        return database::multiFilas($sql, $params);
    }


    public function cargarDatos()
    {
        $sql = 'SELECT id_empleado, nombre_empleado, apellido_empleado, telefono_empleado, correo_empleado, 
         nombre_cargo FROM empleado e INNER JOIN cargo_empleado ce ON e.id_cargo_empleado=ce.id_cargo_empleado
		 WHERE id_estado_empleado NOT IN (4) ORDER BY id_empleado';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    public function cargarCargos()
    {
        $sql = 'SELECT id_cargo_empleado, nombre_cargo FROM cargo_empleado';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    public function cargarEstados()
    {
        $sql = 'SELECT * FROM estado_empleado WHERE id_estado_empleado NOT IN (4)';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    public function crearEmpleado()
    {
        $sql = 'INSERT INTO empleado (dui,nombre_empleado, apellido_empleado, telefono_empleado,correo_empleado,
         direccion_empleado,usuario_empleado,contrasena_empleado,intento_empleado,hora_unlock_empleado,id_cargo_empleado,id_estado_empleado)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        $params = array(
            $this->duiEmpleado, $this->nombreEmpleado, $this->apellidoEmpleado, $this->telefonoEmpleado, $this->correoEmpleado,
            $this->direccionEmpleado, '-', '-', 0, null, $this->cargoEmpleado, 1
        );
        return database::ejecutar($sql, $params);
    }

    public function obtenerDatosEmpleadoActualizar()
    {
        $sql = 'SELECT id_empleado, dui, nombre_empleado, apellido_empleado, telefono_empleado, correo_empleado, direccion_empleado, id_cargo_empleado, id_estado_empleado FROM empleado WHERE id_empleado = ?';
        $params = array($this->identificador);
        return database::filaUnica($sql, $params);
    }

    public function actualizarEmpleado()
    {
        $sql = 'UPDATE empleado SET dui = ?,nombre_empleado = ?, apellido_empleado = ?, telefono_empleado = ?,correo_empleado = ?,
         direccion_empleado = ?,id_cargo_empleado = ? ,id_estado_empleado = ? WHERE id_empleado = ?';
        $params = array(
            $this->duiEmpleado, $this->nombreEmpleado, $this->apellidoEmpleado, $this->telefonoEmpleado, $this->correoEmpleado,
            $this->direccionEmpleado, $this->cargoEmpleado, $this->estadoEmpleado, $this->identificador
        );
        return database::ejecutar($sql, $params);
    }

    public function eliminarEmpleado()
    {
        $sql = 'UPDATE empleado SET id_estado_empleado = ? WHERE id_empleado = ?';
        $params = array(4, $this->identificador);
        return database::ejecutar($sql, $params);
    }
}
