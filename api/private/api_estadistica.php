
<?php
//Se importan los archivos necesarios
require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/estadistica.php');


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
    $estadistica = new Estadistica;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Se escoge el proceso que se ejecutará en el modelo
    switch ($_GET['action']) {
        case 'obtenerProductos':
            if ($result['dataset'] = $estadistica->cargarOpcionesProducto()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'productosTiempo':
            if (!$estadistica->setFechaInicial($_POST['fechainicial'])) {
                $result['exception'] = 'Fecha inicial incorrecta';
            } elseif (!$estadistica->setFechaFinal($_POST['fechafinal'])) {
                $result['exception'] = 'Fecha final incorrecta';
            } elseif ($result['dataset'] = $estadistica->cargarDatos($_POST['identificador'])) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargarDinero':
            if (!$estadistica->setFechaInicial($_POST['fechainicial'])) {
                $result['exception'] = 'Fecha inicial incorrecta';
            } elseif (!$estadistica->setFechaFinal($_POST['fechafinal'])) {
                $result['exception'] = 'Fecha final incorrecta';
            } elseif ($result['dataset'] = $estadistica->cargarDinero()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargarClientes':
            if ($result['dataset'] = $estadistica->cargarCliente()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'trafico':
            if (!$estadistica->setFechaInicial($_POST['fechainicial'])) {
                $result['exception'] = 'Fecha inicial incorrecta';
            } elseif (!$estadistica->setFechaFinal($_POST['fechafinal'])) {
                $result['exception'] = 'Fecha final incorrecta';
            } elseif ($result['dataset'] = $estadistica->trafico()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
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