<?php

// Modelo de usuarios

class Usuario extends Verificador
{

    /*
    * Declaración de variables globales para el modelo
    */

    private $usuarioEmpleado = null;
    private $usuarioCliente = null;
    private $passEmpleado = null;
    private $passCliente = null;
    private $horaEmpleado = null;
    private $intentosEmpleado = null;
    private $idEmpleado = null;
    private $idCliente = null;
    private $nombreUsuario = null;
    private $apellidoUsuario = null;
    private $correoUsuario = null;
    private $telefonoUsuario = null;
    private $direccionUsuario = null;
    private $duiUsuario = null;
    private $usuarioUsuario = null;
    private $passUsuario = null;
    private $estadoCliente = null;
    private $estadoEmpleado = null;


    /*Métodos para asignar valores a las variables globales*/

    public function setUsuarioEmpleado($valor)
    {
        if ($this->validateString($valor, 5, 80)) {
            $this->usuarioEmpleado = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setNombreUsuario($valor)
    {
        if ($this->validateAlphabetic($valor, 5, 80)) {
            $this->nombreUsuario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setApellidoUsuario($valor)
    {
        if ($this->validateAlphabetic($valor, 5, 80)) {
            $this->apellidoUsuario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setCorreoUsuario($valor)
    {
        if ($this->validateEmail($valor)) {
            $this->correoUsuario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setTelefonoUsuario($valor)
    {
        if ($this->validatePhone($valor)) {
            $this->telefonoUsuario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setDUiUsuario($valor)
    {
        if ($this->validateDUI($valor)) {
            $this->duiUsuario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setUsuarioUsuario($valor)
    {
        if ($this->validateString($valor, 5, 80)) {
            $this->usuarioUsuario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setPassUsuario($valor)
    {
        if ($this->validatePassword($valor)) {
            $this->passUsuario = password_hash($valor, PASSWORD_DEFAULT);;
            return true;
        } else {
            return false;
        }
    }

    public function setDireccionUsuario($valor)
    {
        if ($this->validateString($valor, 5, 80)) {
            $this->direccionUsuario = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setUsuariocliente($valor)
    {
        if ($this->validateString($valor, 5, 80)) {
            $this->usuarioCliente = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setPassEmpleado($pass)
    {
        if ($this->validatePassword($pass)) {
            $this->passEmpleado = password_hash($pass, PASSWORD_DEFAULT);
            return true;
        } else {
            return false;
        }
    }

    public function setPassEmpleadoS($pass)
    {
        if ($this->validatePassword($pass)) {
            $this->passEmpleado = $pass;
            return true;
        } else {
            return false;
        }
    }

    public function setPassClienteS($pass)
    {
        if ($this->validatePassword($pass)) {
            $this->passCliente = $pass;
            return true;
        } else {
            return false;
        }
    }

    public function setHoraEmpleado($hora)
    {
        if ($this->validateDate($hora)) {
            $this->horaEmpleado = $hora;
            return true;
        } else {
            return false;
        }
    }

    public function setIntentosEmpleado($intento)
    {
        if ($this->validateNaturalNumber($intento)) {
            $this->intentosEmpleado = $intento;
            return true;
        } else {
            return false;
        }
    }

    public function setIdEmpleado($id)
    {
        if ($this->validateNaturalNumber($id)) {
            $this->idEmpleado = $id;
            return true;
        } else {
            return false;
        }
    }

    public function setIdCliente($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->idCliente = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function getEstado()
    {
        return $this->estadoCliente;
    }

    public function getEstadoEmpleado()
    {
        return $this->estadoEmpleado;
    }

    public function getIdCliente()
    {
        return $this->idCliente;
    }

    public function getIdEmpleado()
    {
        return $this->idEmpleado;
    }

    public function getUsuarioCliente()
    {
        return $this->usuarioCliente;
    }

    public function getUsuarioEmpleado()
    {
        return $this->usuarioEmpleado;
    }



    /*
    * Métodos para realizar las operaciones SCRUD
    */


    //Función para llenar la tabla tomando en cuenta la paginación

    public function llenarTabla()
    {
        $sql = 'SELECT id_empleado,nombre_empleado,usuario_empleado, correo_empleado, hora_unlock_empleado, intento_empleado FROM empleado
        WHERE id_estado_empleado NOT IN (4) AND usuario_empleado NOT IN (?) ORDER BY id_empleado';
        $params = array("-");
        return database::multiFilas($sql, $params);
    }

    //Función que devuelve los datos de los cargos para SELECT's
    public function cargarCargos()
    {
        $sql = 'SELECT id_cargo_empleado, nombre_cargo FROM cargo_empleado';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función que devuelve los nombre de los empleados
    public function cargarEmpleados()
    {
        $sql = '
      SELECT id_empleado, nombre_empleado FROM empleado WHERE id_estado_empleado NOT IN (4) AND usuario_empleado = ?';
        $params = array("-");
        return database::multiFilas($sql, $params);
    }

    //Función que "crea un usuario"
    public function crearUsuario()
    {
        $sql = 'UPDATE empleado SET usuario_empleado = ?, contrasena_empleado = ? WHERE id_empleado = ?';
        $params = array($this->usuarioEmpleado, $this->passEmpleado, $this->idEmpleado);
        return database::ejecutar($sql, $params);
    }


    //Función para "Actualizar" (Resetear intentos) empleados
    public function reestablecerUsuario()
    {
        $sql = 'UPDATE empleado SET hora_unlock_empleado = null, intento_empleado = 5 WHERE id_empleado = ?';
        $params = array($this->idEmpleado);
        return database::ejecutar($sql, $params);
    }

    //Función que "Elimina" un empleado
    public function eliminarUsuario()
    {
        $sql = 'UPDATE empleado SET usuario_empleado = ?, contrasena_empleado = ? WHERE id_empleado = ?';
        $params = array("-", "-", $this->idEmpleado);
        return database::ejecutar($sql, $params);
    }

    //Función que busca el usuario
    public function buscar($buscador, $categoria)
    {
        $sql = 'SELECT id_empleado, nombre_empleado,usuario_empleado, correo_empleado, hora_unlock_empleado, intento_empleado 
        FROM empleado e INNER JOIN cargo_empleado ce ON e.id_cargo_empleado=ce.id_cargo_empleado
        WHERE nombre_empleado ILIKE ?';
        $params = array("%$buscador%");
        if ($categoria != 0) {
            $sql .= ' AND e.id_cargo_empleado = ? ';
            array_push($params, $categoria);
        }
        $sql .= ' AND e.id_cargo_empleado NOT IN (4) AND usuario_empleado NOT IN (?) ORDER BY id_empleado';
        array_push($params, "-");

        return database::multiFilas($sql, $params);
    }

    public function revisarEmpleado()
    {
        $sql = '
		SELECT id_empleado, id_estado_empleado FROM empleado WHERE usuario_empleado = ?;';
        $params = array($this->usuarioEmpleado);
        if ($data = Database::filaUnica($sql, $params)) {
            $this->idEmpleado = $data['id_empleado'];
            $this->estadoEmpleado = $data['id_estado_empleado'];
            return true;
        } else {
            return false;
        }
    }

    //Función que revisa la contraseña del cliente
    public function revisarPassEmpleado()
    {
        $sql = 'SELECT contrasena_empleado FROM empleado WHERE id_empleado = ?';
        $params = array($this->idEmpleado);
        $data = Database::filaUnica($sql, $params);
        if (password_verify($this->passEmpleado, $data['contrasena_empleado'])) {
            return true;
        } else {
            return false;
        }
    }

    /*---------------------- login (pública) ------------------- */

    //Función para revisar si la cuenta del usuario existe

    public function revisarUsuario()
    {
        $sql = '
		SELECT id_cliente, estado_cliente FROM cliente WHERE usuario_cliente = ?;';
        $params = array($this->usuarioCliente);
        if ($data = Database::filaUnica($sql, $params)) {
            $this->idCliente = $data['id_cliente'];
            $this->estadoCliente = $data['estado_cliente'];
            return true;
        } else {
            return false;
        }
    }

    //Función que revisa la contraseña del cliente
    public function revisarPass()
    {
        $sql = 'SELECT contrasena_cliente FROM cliente WHERE id_cliente = ?';
        $params = array($this->idCliente);
        $data = Database::filaUnica($sql, $params);
        if (password_verify($this->passCliente, $data['contrasena_cliente'])) {
            return true;
        } else {
            return false;
        }
    }

    //Función para obtener los datos de la sesión
    public function obtenerSesion()
    {
        $sql = "SELECT CONCAT(e.nombre_empleado, ' ',e.apellido_empleado) AS nombre, nombre_cargo  FROM empleado e
        INNER JOIN cargo_empleado ce ON ce.id_cargo_empleado = e.id_cargo_empleado
        WHERE e.id_empleado = ?";
        $params = array($this->idEmpleado);
        return database::filaUnica($sql, $params);
    }

    //función para crear un nuevo usuario

    public function crearCliente()
    {
        $sql = 'INSERT INTO cliente(
	nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, direccion, dui, visto, usuario_cliente, contrasena_cliente, intento_cliente, hora_unlock_cliente, estado_cliente)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            $this->nombreUsuario, $this->apellidoUsuario, $this->correoUsuario, $this->telefonoUsuario, $this->direccionUsuario,
            $this->duiUsuario, true, $this->usuarioUsuario, $this->passUsuario, 5, null, true
        );
        return database::ejecutar($sql, $params);
    }

    //Función para obtener el id de la orden
    public function factura()
    {
        $sql = "SELECT id_orden_compra, CONCAT(nombre_cliente, ' ',apellido_cliente) AS cliente FROM orden_compra oc
            INNER JOIN cliente c ON c.id_cliente = oc.id_cliente
            WHERE oc.id_cliente = ?
            AND id_orden_compra = (SELECT MAX(id_orden_compra) FROM orden_compra WHERE id_cliente = ?)";
        $params = array($this->idCliente, $this->idCliente);
        return database::filaUnica($sql, $params);
    }

    //Se revisa si está activado el segundo paso de autentificación
    public function verificarFactorEmpleado()
    {
        $sql = 'SELECT factor FROM empleado WHERE id_empleado = ?';
        $params = array($_SESSION['id_empleado_temporal']);
        $data = Database::filaUnica($sql, $params);
        if ($data['factor'] == null) {
            return false;
        } else {
            return true;
        }
    }

    //Función para obtener el código secreto
    public function obtenerFactor()
    {
        $sql = 'SELECT factor FROM empleado WHERE id_empleado = ?';
        $params = array($_SESSION['id_empleado_temporal']);
        return Database::filaUnica($sql, $params);
    }

    //Función para verificar el último cambio de contraseña
    public function cambioObligatorio()
    {
        $sesion = null;
        $sql = 'SELECT cambio_contrasena FROM empleado WHERE id_empleado = ?';
        //Se verifica si ya se inició sesión
        if (isset($_SESSION['id_empleado'])) {
            $sesion = $_SESSION['id_empleado'];
        } elseif (isset($_SESSION['id_empleado_temporal'])) {
            $sesion = $_SESSION['id_empleado_temporal'];
        } else {
            return null;
        }
        $params = array($sesion);
        $data =  Database::filaUnica($sql, $params);
        //Se obtiene la fecha actual
        $fechaActual =  date_format(new DateTime('now'), 'Y-m-d');
        //Se calcula la cantidad de días que existen entre el último cambio y la fecha actual
        $diferencia = abs(strtotime($fechaActual)  - strtotime($data['cambio_contrasena']));
        //Se pasa la diferencia de segundos a minutos
        $total = floor($diferencia / (60 * 60 * 24));
        return $total;
    }

    //Función para generar un registro cuando se inicia sesión
    public function guardarInicioSesion()
    {
        //Se configura la zona horaria
        date_default_timezone_set('America/El_Salvador');
        $sql = 'INSERT INTO actividad_empleado (fecha_actividad, id_empleado, tipo) VALUES (?, ?, true);';
        //Se obtiene la fecha actual
        $fecha = date_format(new DateTime(), 'Y-m-d H:i:s');
        $params = array($fecha, $_SESSION['id_empleado']);
        return Database::ejecutar($sql, $params);
    }

    //Función para generar un registro cuando se termina la sesión
    public function guardarCerrarSesion()
    {
        //Se configura la zona horaria
        date_default_timezone_set('America/El_Salvador');
        $sql = 'INSERT INTO actividad_empleado (fecha_actividad, id_empleado, tipo) VALUES (?, ?, false);';
        //Se obtiene la fecha actual
        $fecha = date_format(new DateTime(), 'Y-m-d H:i:s');
        $params = array($fecha, $_SESSION['id_empleado']);
        return Database::ejecutar($sql, $params);
    }
}
