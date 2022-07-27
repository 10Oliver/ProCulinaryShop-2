<?php
//Se importan los archivos necesarios
require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
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
    $usuario = new usuario;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Se debería crear un método para confirmar si el usuario tiene permitido, todavía en cuestionamiento
    // Elección del proceso a realizar
    switch ($_GET['action']) {
        case 'iniciarSesion':
            $_POST = $usuario->validarFormularios($_POST);
            if (!$usuario->setUsuariocliente($_POST['usuario'])) {
                $result['exception'] = 'Nombre de usuario no valido';
            } elseif (!$usuario->revisarUsuario()) {
                $result['exception'] = 'El nombre de usuario no existe';
            } elseif (!$usuario->getEstado()) {
                $result['exception'] = 'Tu cuenta ha sido desactivada';
            } elseif (!$usuario->setPassClienteS($_POST['pass'])) {
                $result['exception'] = 'Contraseña no valida';
            } elseif ($usuario->revisarPass()) {
                $result['status'] = 1;
                $result['message'] = 'Autentificación completada';
                $_SESSION['id_cliente'] = $usuario->getIdCliente();
                $_SESSION['usuario'] = $usuario->getUsuarioCliente();
            } else {
                $result['exception'] = 'Contraseña incorrecta';
            }
            break;
        case 'guardarCliente':
            $_POST = $usuario->validarFormularios($_POST);
            if (!$usuario->setNombreUsuario($_POST['nombre'])) {
                $result['exception'] = 'Nombre incorrecto';
            } elseif (!$usuario->setApellidoUsuario($_POST['apellido'])) {
                $result['exception'] = 'Apellido incorrecto';
            } elseif (!$usuario->setCorreoUsuario($_POST['correo'])) {
                $result['exception'] = 'Correo incorrecto';
            } elseif (!$usuario->setTelefonoUsuario($_POST['telefono'])) {
                $result['exception'] = 'Teléfono incorrecto';
            } elseif (!$usuario->setDUiUsuario($_POST['dui'])) {
                $result['exception'] = 'DUI incorrecto';
            } elseif (!$usuario->setPassUsuario($_POST['pass'])) {
                $result['exception'] = 'Contraseña incorrecta';
            } elseif (!$usuario->setDireccionUsuario($_POST['direccion'])) {
                $result['exception'] = 'Dirección incorrecta';
            } elseif (!$usuario->setUsuarioUsuario($_POST['usuario'])) {
                $result['exception'] = 'Usuario incorrecto';
            } elseif ($usuario->crearCliente()) {
                $result['status'] = 1;
                $result['message'] = 'Usuario creado éxitosamente';
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'obtenerSesion':
            if (!isset($_SESSION['usuario'])) {
                $result['exception'] = 'No hay una sesión iniciada, no se puede generar el reporte';
            } else {
                if(!$usuario->setIdCliente($_SESSION['id_cliente'])) {
                    $result['exception'] = 'No se encontró el cliente';
                } elseif($result['dataset'] = $usuario->factura()) {
                    $result['status'] = 1;
                } elseif(database::obtenerProblema()) {
                    $result['exception'] = database::obtenerProblema();
                } else {
                    $result['exception'] = 'No se encontraron los datos adecuados';
                }
                
            }
            break;
    }

    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
