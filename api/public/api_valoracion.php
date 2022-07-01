<?php
//Se importan los archivos necesarios
require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/comentarios.php');


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
    $comentario = new comentarios;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Se debería crear un método para confirmar si el usuario tiene permitido, todavía en cuestionamiento
    // Elección del proceso a realizar
    switch ($_GET['action']) {
        case 'cargarDatos':
            if(!$comentario->setIdCliente($_SESSION['id_cliente']))
            {
                $result['exception'] = 'Tu pedido no se encontró';
            }elseif($result['dataset'] = $comentario->obtenerProductos())
            {
                $result['status'] = 1;
            }else{
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'guardarValoracion':
            $_POST = $comentario->validarFormularios($_POST);
            if(!$comentario->setTextoComentario($_POST['comentario']))
            {
                $result['exception'] = 'Comentario no valido';
            }elseif(!$comentario->setValoracionComentario($_POST['valoracion']))
            {
                $result['exception'] = 'valoración no valida';
            }elseif(!$comentario->setIdDetalleOrden($_POST['identificador']))
            {
                $result['exception'] = 'Tu orden no pudo ser encontrada';
            }elseif($comentario->guardarValoracion())
            {
                $result['status'] = 1;
            }else{
                $result['exception'] = database::obtenerProblema();
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
