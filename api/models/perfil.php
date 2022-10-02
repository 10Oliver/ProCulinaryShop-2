<?php

class Perfil extends Verificador
{

    /**
     * Se crea las variables globales para guardar y mantener los datos
     * 
     */

    private $nombre = null;
    private $apellido = null;
    private $telefono = null;
    private $correo = null;
    private $direccion = null;
    private $usuario = null;
    private $pass = null;
    private $factor = null;
    private $fecha = null;
    private $error = null;



    /**
     * Métodos constructores para colocar los datos
     */

    public function setNombre($value)
    {
        if (!$this->validateAlphabetic($value, 3, 60)) {
            $this->error = 'Nombre invalido';
            return false;
        } elseif (!$this->validateDanger($value)) {
            $this->error = $this->getException();
            return false;
        } else {
            $this->nombre = $value;
            return true;
        }
    }

    public function setApellido($value)
    {
        if (!$this->validateAlphabetic($value, 3, 60)) {
            $this->error = 'Apellido invalido';
            return false;
        } elseif (!$this->validateDanger($value)) {
            $this->error = $this->getException();
            return false;
        } else {
            $this->apellido = $value;
            return true;
        }
    }

    public function setTelefono($value) {
        if (!$this->validatePhone($value)) {
            $this->error = 'Teléfono invalido';
            return false;
        } elseif (!$this->validateDanger($value)) {
            $this->error = $this->getException();
            return false;
        } else {
            $this->telefono = $value;
            return true;
        }
    }

    public function setDireccion($value) {
        if (!$this->validateString($value, 5, 60)) {
            $this->error = 'Dirección invalida';
            return false;
        } elseif (!$this->validateDanger($value)) {
            $this->error = $this->getException();
            return false;
        } else {
            $this->direccion = $value;
            return true;
        }
    }

    public function setCorreo($value) {
        if (!$this->validateEmail($value)) {
            $this->error = 'Correo invalido';
            return false;
        } elseif (!$this->validateDanger($value)) {
            $this->error = $this->getException();
            return false;
        } else {
            $this->correo = $value;
            return true;
        }
    }

    public function setFecha($value) {
        if (!$this->validateDate($value)) {
            $this->error = 'Fecha de nacimiento invalida';
            return false;
        } elseif (!$this->validateDanger($value)) {
            $this->error = $this->getException();
            return false;
        } else {
            $this->fecha = $value;
            return true;
        }
    }

    public function setUsuario($value) 
    {
        if (!$this->validateString($value, 3, 60)) {
            $this->error = 'Nombre de usuario incorrecto';
            return false;
        } elseif (!$this->validateDanger($value)) {
            $this->error = $this->getException();
            return false;
        } else {
            $this->usuario = $value;
            return true;
        }
    }

    //Verificación que no contenga datos problemáticos
    public function setLowPass($value)
    {
        if (!$this->validateDanger($value)) {
            $this->error = $this->getException();
            return false;
        } else {
            $this->pass = $value;
            return true;
        }
    }


    //Verificación que la contraseña sea segura
    public function setHighPass($value,$usuario, $nombre, $apellido, $correo, $fecha)
    {
        if (!$this->validateSafePassword($value,$usuario, $nombre, $apellido, $correo, $fecha)) {
            $this->error = $this->getPasswordError();
            return false;
        } else {
            $this->pass = password_hash($value, PASSWORD_DEFAULT);
            return true;
        }
    }

    public function getError()
    {
        return $this->error;
    }

    public function getPass()
    {
        return $this->pass;
    }
    /**
     * Métodos que interactuarán con la base de datos
     */

    //Función para leer datos del perfil

    public function leerPerfil()
    {
        $sql = 'SELECT dui, nombre_empleado, apellido_empleado, telefono_empleado, correo_empleado, direccion_empleado, usuario_empleado,fecha_nacimiento, nombre_cargo, factor FROM empleado e
        INNER JOIN cargo_empleado ce ON ce.id_cargo_empleado = e.id_cargo_empleado
        WHERE id_empleado = ?;';
        $params = array($_SESSION['id_empleado']);
        return Database::filaUnica($sql, $params);
    }

    //Función para actualizar los datos personales del perfil
    public function actualizarDatosPerfil()
    {
         //$sql = 'UPDATE empleado SET nombre_empleado = ?, apellido_empleado = ?, telefono_empleado = ?, correo_empleado = ?, direccion_empleado = ? 
        $sql = 'UPDATE empleado SET nombre_empleado = ?, apellido_empleado = ?, telefono_empleado = ?, correo_empleado = ?, fecha_nacimiento = ?, direccion_empleado = ? 
        WHERE id_empleado = ?';
        $params = array($this->nombre, $this->apellido, $this->telefono, $this->correo,$this->fecha, $this->direccion,  $_SESSION['id_empleado']);
        return database::ejecutar($sql, $params);
    }

    //Función para verifica la contraseña
    public function validarPass()
    {
        $sql = 'SELECT contrasena_empleado FROM empleado WHERE id_empleado = ?';
        $params = array($_SESSION['id_empleado']);
        $data = Database::filaUnica($sql, $params);
        if (!$data) {
            $this->error = 'No se encontró tu perfil';
            return false;
        } elseif (!password_verify($this->pass, $data['contrasena_empleado'])) {
            $this->error = 'Contraseña incorrecta';
            return false;
        } else {
            return true;
        }
    }

    //Función para obtener la contraseña
    public function obtenerPass()
    {
        $sql = 'SELECT contrasena_empleado FROM empleado WHERE id_empleado = ?';
        $params = array($_SESSION['id_empleado']);
        return Database::filaUnica($sql, $params);
    }

    //Función para obtener el nombre de usuario
    public function obtenerUsuario()
    {
        $sql = 'SELECT usuario_empleado FROM empleado WHERE id_empleado = ?';
        $params = array($_SESSION['id_empleado']);
        return Database::filaUnica($sql, $params);
    }

    //Función para actualizar los datos
    public function actualizarCuenta($pass)
    {
        $sql = 'UPDATE empleado SET usuario_empleado = ?, contrasena_empleado = ? WHERE id_empleado = ?';
        $params = array($this->usuario, $pass, $_SESSION['id_empleado']);
        return Database::ejecutar($sql, $params);
    }

    //Función para guardar la llave secreta para la autentificación en dos pasos
    public function activarFactor($codigo)
    {
        $sql = 'UPDATE empleado SET factor = ? WHERE id_empleado = ?';
        $params = array($codigo, $_SESSION['id_empleado']);
        return Database::ejecutar($sql, $params);
    }
}
