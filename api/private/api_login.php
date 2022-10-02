<?php
//Se importan los archivos necesarios
require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../helpers/autenticator.php');
require_once('../models/usuario.php');


/*
    * Comprobación para la acción que se realizará usando los métodos del modelo
    * de empleado y ejecutados en database.php
    *
    * La acción se recibirá del controlador
    */
if (isset($_GET['action'])) {
    //Se crea o reiniciar una sesión
    session_start();
    //Se instancia la clase correspondiente en la variable
    $usuario = new Usuario;
    $autentificador = new Autentificador;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Verificación de que el usuario ha iniciado sesión o no
    if (isset($_SESSION['id_empleado'])) {
        switch ($_GET['action']) {
            case 'datosSesion':
                if (!isset($_SESSION['id_empleado'])) {
                    $result['exception'] = 'Debes iniciar sesión';
                } elseif (!$usuario->setIdEmpleado($_SESSION['id_empleado'])) {
                    $result['exception'] = 'No se logró localizar tu usuario';
                } elseif ($result['dataset'] = $usuario->obtenerSesion()) {
                    $result['status'] = 1;
                } elseif (database::obtenerProblema()) {
                    $result['exception'] = database::obtenerProblema();
                } else {
                    $result['exception'] = 'Tu cuenta no se ha encontrado';
                }
                break;
            case 'CerrarSesion':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'La sesión ha finalizado';
                } else {
                    $result['exception'] = 'La sesión no se pudo finalizar';
                }
                break;
            default:
                $result['exception'] = 'La acción solicitada necesita realizarse fuera de una sesión activa, por favor finaliza la sesión para utitlizarla';
            break;
        }
    } else {
        // Elección del proceso a realizar
        switch ($_GET['action']) {
            case 'iniciarSesion':
                $_POST = $usuario->validarFormularios($_POST);
                if (!$usuario->setUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'Nombre de usuario no valido';
                } elseif (!$usuario->revisarEmpleado()) {
                    $result['exception'] = 'El nombre de usuario no existe';
                } elseif ($usuario->getEstadoEmpleado() != 1) {
                    $result['exception'] = 'Tu cuenta ha sido desactivada';
                } elseif (!$usuario->setPassEmpleadoS($_POST['pass'])) {
                    $result['exception'] = 'Contraseña no valida';
                } elseif ($usuario->revisarPassEmpleado()) {
                    $_SESSION['id_empleado_temporal'] = $usuario->getIdEmpleado();
                    $_SESSION['usuario'] = $usuario->getUsuarioEmpleado();
                    //Se procede a revisar si está activado el segundo paso de autentificación
                    if ($usuario->verificarFactorEmpleado()) {
                        //Si está activada, solo se le muestra que debe de proseguir con su completación
                        $result['status'] = 2;
                    } else {
                        //Si no está activada, únicamente se le dirá si estpa completada o no
                        $result['status'] = 1;
                        $_SESSION['id_empleado'] = $_SESSION['id_empleado_temporal'];
                        unset($_SESSION['id_empleado_temporal']);
                    }
                    $result['message'] = 'Autentificación completada';
                } else {
                    $result['exception'] = 'Contraseña incorrecta';
                }
                break;
            case 'verificarActivacion':
                //Se verifica que el segundo factor de autentificación está activado
                if (!isset($_SESSION['id_empleado_temporal'])) {
                    $result['exception'] = 'No tienes activado el segundo factor de autentificación';
                } else {
                    $result['status'] = 1;
                    $result['message'] = 'El segundo paso de autentificación ha sido activado';
                }
                break;
            case 'verificarSegundoPaso':
                //Se sanean los campos
                $_POST = $usuario->validarFormularios($_POST);
                //Se obtiene el token secreto de la cuenta
                if (!isset($_SESSION['id_empleado_temporal'])) {
                    //Se envia el estado para que se redireccione al login
                    $result['status'] = 2;
                    $result['exception'] = 'No tienes activado el segundo factor de autentificación';
                } elseif (!$data = $usuario->obtenerFactor()) {
                    $result['exception'] = 'No tienes activado el segundo factor de autentificación';
                } elseif ($autentificador->validateCode($data['factor'], $_POST['codigo'])) {
                    $result['status'] = true;
                    $result['message'] = 'Segundo paso de autentificación completado con éxito';
                    //Se convierte el id temporal a un id completo de sesión
                    $_SESSION['id_empleado'] = $_SESSION['id_empleado_temporal'];
                    //Se elimina el id temporal
                    unset($_SESSION['id_temporal']);
                } elseif (Database::obtenerProblema()) {
                    $result['exception'] = Database::obtenerProblema();
                } else {
                    $result['exception'] = 'Código incorrecto';
                }
                break;
            case 'obtenerSesion':
                if (!isset($_SESSION['usuario'])) {
                    $result['exception'] = 'No hay una sesión iniciada, no se puede generar el reporte';
                } else {
                    $result['status'] = 1;
                    $result['dataset'] = $_SESSION['usuario'];
                }
                break;
            default:
                $result['exception'] = 'La acción solicitada necesita de una sesión activa, por favor inicia sesión';
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
