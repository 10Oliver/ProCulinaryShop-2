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

    if(isset($_GET['action'])){
        //Se crea la sesión 
        session_start();
        //Se instancia la clase del modelo
        $usuario = new usuario;
        //Se crea el vector de datos que se retonarán
        $result = array('status'=>0,'message'=>null,'exception'=>null, 'dataset'=>null);

        // Elección del proceso a realizar
        switch($_GET['action']){
            case 'leerTablas':
                if($result['dataset'] = $usuario->llenarTabla())
                {
                    $result['status'] = 1;
                }elseif(database::obtenerProblema())
                {
                    $result['exception'] = database::obtenerProblema();
                }else{
                    $result['exception'] = 'No hay datos de momento.';
                }
                break;
            case 'cargarCargos':
                //Llena el SELECT de los cargos disponibles
                if($result['dataset'] = $usuario->cargarCargos())
                {
                    $result['status'] = 1;
                }elseif(database::obtenerProblema())
                {
                    $result['exception'] = database::obtenerProblema();
                }else{
                    $result['exception'] = "No existen datos de momento";
                }
                break;
            case 'cargarEmpleados':
                if($result['dataset'] = $usuario->cargarEmpleados())
                {
                    $result['status'] = 1;
                }elseif(database::obtenerProblema())
                {
                    $result['exception'] = database::obtenerProblema();
                }else{
                    $result['exception'] = 'No hay datos de momento';
                }
                break;
            case 'crearUsuario':
                //Se limpian los datos del formulario
                $_POST = $usuario->validarFormularios($_POST);
                if(!$usuario->setUsuarioEmpleado($_POST['nombre_usuario']))
                {
                    $result['exception'] = "Nombre invalido";
                }elseif(!$usuario->setPassEmpleado($_POST['contrasena_usuario']))
                {
                    $result['exception'] = "Contraseña invalida";
                }elseif(!$usuario->setIdEmpleado($_POST['select_empleados']))
                {
                    $result['exception'] = "Empleado invalido";
                }elseif($usuario->crearUsuario())
                {
                    $result['status'] = 1;
                    $result['message'] = "Usuario creado satisfactoriamente";
                }else{
                    $result['exception'] = database::obtenerProblema();
                }
                break;
            case 'actualizarUsuario':
                if(!$usuario->setIdEmpleado($_POST['identificador_p']))
                {
                    $result['exception'] = "El identificador no se cargó correctamente";
                }elseif($usuario->reestablecerUsuario())
                {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario reestablecido correctamente';
                }else{
                    $result['exception'] = database::obtenerProblema();
                }
                break;
            case 'eliminarUsuario':
                if(!$usuario->setIdEmpleado($_POST['identificador_p']))
                {
                    $result['exception'] = "El identificador no se cargó correctamente";
                }elseif($usuario->eliminarUsuario())
                {
                    $result['status'] = 1;
                    $result['message'] = 'El usuario fue eliminado correctamente';
                }else{
                    $result['exception'] = database::obtenerProblema();
                }
                break;
            case 'buscar':
                $_POST = $usuario->validarFormularios($_POST);
                if($result['dataset'] = $usuario->buscar($_POST['buscador'],$_POST['categoria']))
                {
                    $result['status'] = 1;
                }elseif(database::obtenerProblema())
                {
                    $result['exception'] = database::obtenerProblema();
                }else{
                    $result['exception'] = "No hay datos de momento";
                }
                break;
        }
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('content-type: application/json; charset=utf-8');
         // Se imprime el resultado en formato JSON y se retorna al controlador.
         print(json_encode($result));

    }else{

    }


?>