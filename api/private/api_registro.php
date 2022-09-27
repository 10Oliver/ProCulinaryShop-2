<?php
//Se importan las clases necesarias para el funcionamiento
require_once '../helpers/database.php';
require_once '../helpers/verificador.php';
require_once '../models/empleado.php';

//Se inicia la sesión
session_start();

//Se crean los objetos de las clases correspondiente
$empleado = new Empleado;

//Se crea un arreglo por donde se enviarán los datos devuelta al cliente
$result = array('status' => 0, 'dataset' => null, 'message' => null, 'exception' => null);

//Se revisa que exista una petición a la API
if (isset($_GET['action'])) {
    //Se verifica que exista una sesión
    if (isset($_SESSION['id_empleado'])) {
        //Se verifica la acción solicitada
        switch($_GET['action']) {
            case 'registrar':
                //Se limpian los campos
                $_POST = $empleado->validarFormularios($_POST);
                //Se comienzan a colocar los datyos
                break;
        }
    } else {
        switch ($_GET['action']) {
            case 'registrar':
                //Se limpian los campos
                $_POST = $empleado->validarFormularios($_POST);
                //Se verifica que no existan más empleados en la base de datos
                if (!$empleado->verificarexistencia()) {
                    $result['exception'] = 'No puedes agregar un nuevo empleado debido a que ya se ha registrado con anterioridad';
                } elseif (!$empleado->setDuiEmpleado($_POST['dui'])) {
                    $result['exception'] = 'DUI incorrecto'.$_POST['dui'];
                } elseif (!$empleado->setNombreEmpleado($_POST['nombre'])) {
                    $result['exception'] = 'Nombre de empleado incorrecto';
                } elseif (!$empleado->setApellidoEmpleado($_POST['apellido'])) {
                    $result['exception'] = 'Apellido de empleado incorrecto';
                } elseif (!$empleado->setTelefonoEmpleado($_POST['telefono'])) {
                    $result['exception'] = 'Teléfono incorrecto';
                } elseif (!$empleado->setCorreoEmpleado($_POST['correo'])) {
                    $result['exception'] = 'Correo incorrecto';
                } elseif (!$empleado->setDireccionEmpleado($_POST['direccion'])) {
                    $result['exception'] = 'Dirección incorrecta';
                } elseif (!$empleado->setFechaNacimiento($_POST['fecha_nacimiento'])) {
                    $result['exception'] = 'Fecha de nacimiento incorrecta';
                } elseif (!$empleado->setUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Nombre de usuario incorrecto o es demasiado corto';
                } elseif (!$empleado->setPassEmpleado($_POST['pass'])) {
                    $result['exception'] = $empleado->getPasswordError(). $_POST['pass'];
                } elseif ($empleado->registrarEmpleado()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro de primer usuario finalizado con éxito';
                } elseif (Database::obtenerProblema()) {
                    $result['exception'] = Database::obtenerProblema();
                } else {
                    $result['exception'] = 'El registro de usuario ha fallado';
                }
                break;
        }
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}