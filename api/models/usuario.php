<?php

// Modelo de usuarios

class usuario extends Verificador{

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
    private $estadoCliente = null;


    /*Métodos para asignar valores a las variables globales*/

    public function setUsuarioEmpleado($valor)
    {
        if($this->validateString($valor,5,80)){
            $this->usuarioEmpleado = $valor;
            return true;
        }else{
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
        if($this->validatePassword($pass)){
            $this->passEmpleado = password_hash($pass, PASSWORD_DEFAULT);
            return true;
        }else{
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
        if($this->validateDate($hora)){
            $this->horaEmpleado = $hora;
            return true;
        }else{
            return false;
        }
        
    }

    public function setIntentosEmpleado($intento)
    {
        if($this->validateNaturalNumber($intento)){
            $this->intentosEmpleado = $intento;
            return true;
        }else{
            return false;
        }
        
    }

    public function setIdEmpleado($id)
    {
        if($this->validateNaturalNumber($id)){
            $this->idEmpleado = $id;
            return true;
        }else{
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

    public function getIdCliente()
    {
        return $this->idCliente;
    }

    public function getUsuarioCliente()
    {
        return $this->usuarioCliente;
    }



    /*
    * Métodos para realizar las operaciones SCRUD
    */


    //Función para llenar la tabla tomando en cuenta la paginación

    public function llenarTabla(){
        $sql = 'SELECT id_empleado,nombre_empleado,usuario_empleado, correo_empleado, hora_unlock_empleado, intento_empleado FROM empleado
        WHERE id_estado_empleado NOT IN (4) AND usuario_empleado NOT IN (?) ORDER BY id_empleado';
        $params = array("-");
        return database::multiFilas($sql,$params);
    }

    //Función que devuelve los datos de los cargos para SELECT's
    public function cargarCargos()
    {
        $sql = 'SELECT id_cargo_empleado, nombre_cargo FROM cargo_empleado';
        $params = null;
        return database::multiFilas($sql,$params);
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
        $params = array("-","-",$this->idEmpleado);
        return database::ejecutar($sql, $params);
    }

    //Función que busca el usuario
    public function buscar($buscador, $categoria){
        $sql = 'SELECT id_empleado, nombre_empleado,usuario_empleado, correo_empleado, hora_unlock_empleado, intento_empleado 
        FROM empleado e INNER JOIN cargo_empleado ce ON e.id_cargo_empleado=ce.id_cargo_empleado
        WHERE nombre_empleado ILIKE ?';
        $params = array("%$buscador%");
        if($categoria!=0){
            $sql .= ' AND e.id_cargo_empleado = ? ';
            array_push($params, $categoria);
        }
        $sql .= ' AND e.id_cargo_empleado NOT IN (4) AND usuario_empleado NOT IN (?) ORDER BY id_empleado';
        array_push($params, "-");
       
        return database::multiFilas($sql,$params);
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

}

?>