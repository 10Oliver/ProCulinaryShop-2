<?php

//Se importan los archivos necesarios
require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/perfil.php');
require_once('../helpers/autenticator.php');

if (isset($_GET['action'])) {
    //Se crea o reiniciar una sesión
    session_start();
    //Se instancia la clase correspondiente en la variable
    $perfil = new Perfil;
    $autentificador = new Autentificador;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);

    //Se revisa que exista una sesión activa
    if (isset($_SESSION['id_empleado'])) {
        //Se crea las opciones que podrá realizar la api
        switch ($_GET['action']) {
            case 'leerPerfil':
                if ($result['dataset'] = $perfil->leerPerfil()) {
                    $result['status'] = 1;
                } elseif (Database::obtenerProblema()) {
                    $result['exception'] = Database::obtenerProblema();
                } else {
                    $result['exception'] = 'No se encontró tu perfil';
                }
                break;
            case 'actualizarDatosPerfil':
                //Se limpian los campos
                $_POST = $perfil->validarFormularios($_POST);
                //Se comienzan a colocar los datos
                if (!$perfil->setNombre($_POST['nombre'])) {
                    $result['exception'] = $perfil->getError();
                } elseif (!$perfil->setApellido($_POST['apellido'])) {
                    $result['exception'] = $perfil->getError();
                } elseif (!$perfil->setTelefono($_POST['telefono'])) {
                    $result['exception'] = $perfil->getError();
                } elseif (!$perfil->setCorreo($_POST['correo'])) {
                    $result['exception'] = $perfil->getError();
                } elseif (!$perfil->setDireccion($_POST['direccion'])) {
                    $result['exception'] = $perfil->getError();
                } elseif (!$perfil->setFecha($_POST['fecha'])) {
                    $result['exception'] = $perfil->getError();
                } elseif ($perfil->actualizarDatosPerfil()) {
                    $result['status'] = 1;
                    $result['message'] = 'Datos actualizados correctamente';
                } elseif (Database::obtenerProblema()) {
                    $result['exception'] = Database::obtenerProblema();
                } else {
                    $result['exception'] = 'Ocurrió un problema durante la actualización de datos';
                }
                break;
            case 'verificarPass':
                //Se verifica la contraseña actual
                if (!$perfil->setLowPass($_POST['pass'])) {
                    $result['exception'] = $perfil->getError();
                } elseif ($perfil->validarPass()) {
                    $result['status'] = 1;
                    $_SESSION['verificacion'] = true;
                } elseif (Database::obtenerProblema()) {
                    $result['exception'] = Database::obtenerProblema();
                } else {
                    $result['exception'] = $perfil->getError();
                }
                break;
            case 'NombreUsuario':
                //Se verifica que ya se haya pasado por la verificación
                if (!isset($_SESSION['verificacion'])) {
                    $result['exception'] = 'Debes de verificar tu identidad antes de proceder';
                } elseif ($result['dataset'] = $perfil->obtenerUsuario()) {
                    $result['status'] = 1;
                } elseif (Database::obtenerProblema()) {
                    $result['exception'] = Database::obtenerProblema();
                } else {
                    $result['exception'] = 'Ocurrió un problema al cargar los datos';
                }
                break;
            case 'actualizarRegistro':
                //Se verifica que ya se haya pasado por la verificación
                if (!isset($_SESSION['verificacion'])) {
                    $result['exception'] = 'Debes de verificar tu identidad antes de proceder';
                } elseif (!$perfil->setUsuario($_POST['usuario'])) {
                    $result['exception'] = $perfil->getError();
                } elseif (trim($_POST['pass']) === '') {
                    //Si no se colocó la contraseña se obtiene la actual
                    if (!$data = $perfil->obtenerPass()) {
                        $result['exception'] = 'Ocurrió un problema al obtener datos';
                    } elseif ($perfil->actualizarCuenta($data['contrasena_empleado'])) {
                        $result['status'] = 1;
                        $result['message'] = 'Cuenta actualizada correctamente';
                        //Se quita la autentificación
                        unset($_SESSION['verificacion']);
                    } elseif (Database::obtenerProblema()) {
                        $result['exception'] = Database::obtenerProblema();
                    } else {
                        $result['exception'] = 'Ocurrió un problema durante el cambio de contraseña';
                    }
                } elseif (!$data = $perfil->leerPerfil()) {
                    $result['exception'] = 'Ocurrió un problema durante la verificación de la contraseña';
                } elseif (!$perfil->setHighPass($_POST['pass'], $data['usuario_empleado'], $data['nombre_empleado'], $data['apellido_empleado'], $data['correo_empleado'], $data['fecha_nacimiento'])) {
                    $result['exception'] = $perfil->getError();
                } elseif ($perfil->actualizarCuenta($perfil->getPass())) {
                    $result['status'] = 1;
                    $result['message'] = 'Cuenta actualizada correctamente';
                } elseif (Database::obtenerProblema()) {
                    $result['exception'] = Database::obtenerProblema();
                } else {
                    $result['exception'] = 'Ocurrió un problema durante la actualización de la cuenta';
                }
                break;
            case 'solicitarAutentificacion':
                //Se verifica que ya se haya pasado por la verificación
                if (!isset($_SESSION['verificacion'])) {
                    $result['exception'] = 'Debes de verificar tu identidad antes de proceder';
                } elseif ($result['dataset'] = $autentificador->secretGenerator()) {
                    $result['status'] = 1;
                    $result['message'] = 'Código generado correctamente';
                    //Se quita la autentificación
                    unset($_SESSION['verificacion']);
                } else {
                    $result['exception'] = 'Ocurrió un problema durante la generación';
                }
                break;
            case 'activarFactor':
                //Se revisa que ya se ha generado el código
                if (!isset($_SESSION['identificador'])) {
                    $result['exception'] = 'Ocurrió un problema al verificar el proceso';
                    //Se verifica si el código ingresado es incorrecto
                } elseif (!$autentificador->validateCode($_SESSION['identificador'], $_POST['codigo'])) {
                    $result['exception'] = 'Código incorrecto';
                    //Se guarda en la base de datos
                } elseif ($perfil->activarFactor($_SESSION['identificador'])) {
                    $result['status'] = true;
                    $result['message'] = 'Segundo paso de autentificación activado correctamente';
                    //Se elimina el secreto temporal
                    unset($_SESSION['identificador']);
                } elseif (Database::obtenerProblema()) {
                    $result['exception'] = Database::obtenerProblema();
                } else {
                    $result['exception'] = 'Ocurrió un problema durante la actualización del servicio';
                }
                break;
        }
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
    }
} else {
    print(json_encode('Recurso no disponible'));
}
