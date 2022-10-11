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
                //Se verifica que exista la sesión activa
                if (isset($_SESSION['id_empleado'])) {
                    //Se guarda el registro que se ha cerrado sesión
                    if ($usuario->guardarCerrarSesion()) {
                        $result['status'] = 1;
                        $result['message'] = 'La sesión ha finalizado';
                        //Se eliminan lo campos
                        unset($_SESSION['id_empleado']);
                    } else {
                        $result['exception'] = 'Ocurrió un problema en el cerrado de sesión';
                    }
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
                } elseif (!$data = $usuario->verificarEstadoCuenta()) {
                    $result['exception'] = 'Ocurrió un problema durante la verificación del estado de tu cuenta';
                } elseif ($usuario->getEstadoEmpleado() > 2) {
                    $result['exception'] = 'Tu cuenta ha sido desactivada';
                } elseif(!$usuario->desbloquear()) {
                    $result['exception'] = 'Ocurrió un problema durante la verificación del desbloqueo de tu cuenta';
                } elseif ($usuario->getEstadoEmpleado() == 2) {
                    $result['exception'] = 'Tu cuenta ha sido desactivada por alcanzar la cantidad máxima de intentos fallidos, intentalo más tarde.';
                } elseif (!$usuario->setPassEmpleadoS($_POST['pass'])) {
                    $result['exception'] = 'Contraseña no valida';
                } elseif ($usuario->revisarPassEmpleado()) {
                    $_SESSION['id_empleado_temporal'] = $usuario->getIdEmpleado();
                    $_SESSION['usuario'] = $usuario->getUsuarioEmpleado();
                    //Se verifica la fecha del último cambio de la contraseña
                    if (!$data = $usuario->cambioObligatorio()) {
                        $result['exception'] = 'Ocurrió un problema durante la búsqueda de tus datos';
                    } elseif ($data >= 90) {
                        $result['exception'] = 'Han pasado más de 90 días desde que cambiaste tu contraseña, por favor inicia el proceso de recuperación';
                    } else {
                        //Se procede a revisar si está activado el segundo paso de autentificación
                        if ($usuario->verificarFactorEmpleado()) {
                            //Si está activada, solo se le muestra que debe de proseguir con su completación
                            $result['status'] = 2;
                        } else {
                            //Se cambia el id temporal por el permanente
                            $_SESSION['id_empleado'] = $_SESSION['id_empleado_temporal'];
                            unset($_SESSION['id_empleado_temporal']);
                            //Se registra el inicio de sesión
                            if ($usuario->guardarInicioSesion()) {
                                //Si no está activada, únicamente se le dirá si estpa completada o no
                                $result['status'] = 1;
                            } else {
                                $result['exception'] = 'Ocurrió un problema durante el registro de sesión';
                            }
                        }
                        //Se procede a configurar el mensaje dependiendo de los días en que se cambió la contraseña
                        if ($data >= 80) {
                            //Se coloca un dato extra para que se muestre en el dashboard
                            $_SESSION['advertencia'] = $data;
                        }
                        $result['message'] = 'Autentificación completada';
                    }
                } else {
                    //Se procede a disminuir la cantidad de intentos
                    if ($usuario->disminuirIntentos()) {
                        //Se revisa el estado de la cuenta
                        if (!$data = $usuario->verificarEstadoCuenta()) {
                            $result['exception'] = 'Ocurrió un problema durante la revisión de la contraseña';
                        } elseif ($data['id_estado_empleado'] != 1) {
                            $result['exception'] = 'Tu cuenta ha sido bloqueda por 24 horas';
                        } elseif (Database::obtenerProblema()) {
                            $result['exception'] = Database::obtenerProblema();
                        } else {
                            $result['exception'] = 'Contraseña incorrecta';
                        }
                    } elseif (Database::obtenerProblema()) {
                        $result['exception'] = Database::obtenerProblema();
                    } else {
                        $result['exception'] = 'Ocurrió un problema durante la revisión de la contraseña';
                    }
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
