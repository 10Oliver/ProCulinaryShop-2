
<?php
//Se importan los archivos necesarios

use LDAP\Result;

require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/cliente.php');


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
    $cliente = new Cliente;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Se escoge el proceso que se ejecutará en el modelo
    switch ($_GET['action']) {
        case 'cargarDatos':
            if ($result['dataset'] = $cliente->cargarClientes()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'buscar':
            $_POST = $cliente->validarFormularios($_POST);
            if (!$cliente->setBuscador(($_POST['buscador']))) {
                $result['exception'] = 'El valor a buscar no es valido';
            } elseif ($result['dataset'] = $cliente->buscar()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'actualizarCliente':
            if (!$cliente->setIdCliente($_POST['identificador_p'])) {
                $result['exception'] = 'No se logró identificar el cliente';
            } elseif (!$cliente->setEstadoCliente($_POST['valor'])) {
                $result['exception'] = 'No se logró identificar el nuevo estado';
            } elseif ($cliente->actualizarEstado()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'reporte':
            if (!$cliente->setIdCliente($_POST['identificador'])) {
                $result['exception'] = 'No se logró identificar el cliente';
            } elseif ($result['dataset'] = $cliente->reporte()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'El cliente no ha adquirido ningún producto recientemente';
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


?>