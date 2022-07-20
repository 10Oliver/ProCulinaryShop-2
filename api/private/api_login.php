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
            if(!$usuario->setUsuariocliente($_POST['usuario']))
            {
                $result['exception'] = 'Nombre de usuario no valido';
            }elseif(!$usuario->revisarUsuario())
            {
                $result['exception'] = 'El nombre de usuario no existe';
            }elseif($usuario->getEstado()!=1)
            {
                $result['exception'] = 'Tu cuenta ha sido desactivada';
            }elseif(!$usuario->setPassClienteS($_POST['pass']))
            {
                $result['exception'] = 'Contraseña no valida';
            }elseif($usuario->revisarPass())
            {
                $result['status'] = 1;
                $result['message'] = 'Autentificación completada';
                $_SESSION['id_cliente'] = $usuario->getIdCliente();
                $_SESSION['usuario'] = $usuario->getUsuarioCliente();
            }else{
                $result['exception'] = 'Contraseña incorrecta';
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
