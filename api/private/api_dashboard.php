
<?php
//Se importan los archivos necesarios
require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/dashboard.php');


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
    $dashboard = new Dashboard;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Se revisa si realmente se ha iniciado sesión o no
    if (isset($_SESSION['id_empleado'])) {
        //Se escoge el proceso que se ejecutará en el modelo
        switch ($_GET['action']) {
            case 'obtenerConexiones':
                if ($result['dataset'] = $dashboard->InicioSesion()) {
                    $result['status'] = 1;
                    //Se verifica si hay advertencia de cambio
                    if (isset($_SESSION['advertencia'])) {
                        $result['message'] = 'Han pasado '.$_SESSION['advertencia']. ' días desde que cambiaste por última vez tu contraseña, por favor cámbiala para que no pierdas acceso';
                    }
                } elseif (database::obtenerProblema()) {
                    $result['exception'] = database::obtenerProblema();
                } else {
                    $result['exception'] = 'No hay datos de momento';
                }
                break;
        }
    } else {
        
        //Si no hay ninguna opción dentro de los datos
        $result['exception'] = 'Necesitas iniciar sesión para continuar';
    }

    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}


?>