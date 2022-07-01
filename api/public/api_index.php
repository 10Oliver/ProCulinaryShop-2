
<?php
//Se importan los archivos necesarios

use LDAP\Result;

require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/noticias.php');


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
    $noticia = new noticia;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Se escoge el proceso que se ejecutará en el modelo
    switch ($_GET['action']) {
        case 'cargarNoticias':
            if($result['dataset'] = $noticia->cargarNoticias())
            {
                $result['status'] = 1;
            }elseif(database::obtenerProblema())
            {
                $result['exception'] = database::obtenerProblema();
            }else{
                $result['exception'] = 'No hay noticias disponibles';
            }
            break;
        case 'obtenerSesion':
            if(isset($_SESSION['id_cliente']))
            {
                $result['dataset'] = $_SESSION['usuario'];
                $result['status'] = 1;
            }else{
                $result['status'] = 2;
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
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}


?>