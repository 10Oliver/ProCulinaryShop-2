
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
    if(isset($_GET['action'])) {
        //Se crea o reiniciar una sesión
        session_start();
        //Se instancia la clase correspondiente en la variable
        $comentario = new comentarios;
        //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
        $result = array('status'=>0, 'message'=>null, 'dataset' =>null, 'exception'=> null);
        //Se escoge el proceso que se ejecutará en el modelo
        switch($_GET['action']){
            case 'cargarDatos':
                if($result['dataset'] = $comentario->cargarComentarios())
                {
                    $result['status'] = 1;
                }elseif(database::obtenerProblema())
                {
                    $result['exception'] = database::obtenerProblema();
                }else{
                    $result['exception'] = 'No hay datos de momento';
                }
                break;
            case 'actualizarComentario':
                if(!$comentario->setIdComentario($_POST['identificador_p']))
                {
                    $result['exception'] = 'No se logró identificar el comentario';
                }elseif(!$comentario->setEstadoComentario($_POST['valor']))
                {
                    $result['exception'] = 'No se logró identificar el nuevo estado';
                }elseif($comentario->cambiarEstado())
                {
                    $result['status'] = 1;
                }else{
                    $result['exception'] = database::obtenerProblema();
                }
                break;
            case 'buscar':
                $_POST = $comentario->validarFormularios($_POST);
                if($result['dataset'] = $comentario->buscar($_POST['buscador']))
                {
                    $result['status'] = 1;
                }elseif(database::obtenerProblema())
                {
                    $result['exception'] = database::obtenerProblema();
                }else{
                    $result['exception'] = 'No hay datos que mostrar de momento';
                }
        }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
    }else{
         print(json_encode('Recurso no disponible'));

    }


?>