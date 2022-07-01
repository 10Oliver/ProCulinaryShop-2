<?php
//Se importan los archivos necesarios
require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/empleado.php');


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
    $empleado = new empleado;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);

    //Se debería crear un método para confirmar si el usuario tiene permitido, todavía en cuestionamiento
    // Elección del proceso a realizar
    switch ($_GET['action']) {
        case 'cargarDatos':
            //Carga los datos en la tabla
            if ($result['dataset'] = $empleado->cargarDatos()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'crearEmpleado':
            //Crea un empleado a partir de la información del modal
            $_POST = $empleado->validarFormularios($_POST);
            if (!$empleado->setNombreEmpleado($_POST['nombre_empleado'])) {
                $result['exception'] = "Nombre incorrecto";
            } elseif (!$empleado->setApellidoEmpleado($_POST['apellido_empleado'])) {
                $result['exception'] = 'Apellido incorrecto';
            } elseif (!$empleado->setDireccionEmpleado($_POST['direccion_empleado'])) {
                $result['exception'] = 'Dirección incorrecta';
            } elseif (!$empleado->setDuiEmpleado($_POST['dui_empleado'])) {
                $result['exception'] = 'DUI incorrecto';
            } elseif (!$empleado->setCargoEmpleado($_POST['cargo_empleado'])) {
                $result['exception'] = 'Cargo incorrecto';
            } elseif (!$empleado->setCorreoEmpleado($_POST['correo_empleado'])) {
                $result['exception'] = 'Correo incorrecto';
            } elseif (!$empleado->setTelefonoEmpleado($_POST['telefono_empleado'])) {
                $result['exception'] = 'Teléfono incorrecto';
            } elseif ($empleado->crearEmpleado()) {
                $result['status'] = 1;
                $result['message'] = "Empleado creado correctamente";
            } else {
                $result['exception'] = database::obtenerProblema();
                $result['message'] = "Hubo un problema al ejecutar";
            }
            break;
        case 'cargarCargos':
            //Llena el SELECT de los cargos disponibles
            if ($result['dataset'] = $empleado->cargarCargos()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = "No existen datos de momento";
            }
            break;
        case 'cargarEstados':
            //Se llena el SELECT con los estados disponibles
            if ($result['dataset'] = $empleado->cargarEstados()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = "No existen datos de momentos";
            }
            break;
        case 'obtenerActualizar':
            if (!$empleado->setIdentificador($_POST['identificador_p'])) {
                $result['exception'] = "El producto cargado no se pueda usar";
            } elseif ($result['dataset'] = $empleado->obtenerDatosEmpleadoActualizar()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = "El producto no existe";
            }
            break;
        case "actualizarEmpleado":
            //Crea un empleado a partir de la información del modal
            $_POST = $empleado->validarFormularios($_POST);
            //Se van agregando los datos al modelo, y en dado caso se notifica si algunos
            //de estos no es correcto
            if (!$empleado->setNombreEmpleado($_POST['nombre_empleado'])) {
                $result['exception'] = "Nombre incorrecto";
            } elseif (!$empleado->setIdentificador($_POST['identificador'])) {
                $result['exception'] = "No se pudo encontrar el empleado";
            } elseif (!$empleado->setApellidoEmpleado($_POST['apellido_empleado'])) {
                $result['exception'] = 'Apellido incorrecto';
            } elseif (!$empleado->setDireccionEmpleado($_POST['direccion_empleado'])) {
                $result['exception'] = 'Dirección incorrecta';
            } elseif (!$empleado->setDuiEmpleado($_POST['dui_empleado'])) {
                $result['exception'] = 'DUI incorrecto';
            } elseif (!$empleado->setCargoEmpleado($_POST['cargo_empleado'])) {
                $result['exception'] = 'Cargo incorrecto';
            } elseif (!$empleado->setEstadoEmpleado($_POST['estado_empleado'])) {
                $result['exception'] = 'Estado incorrecto';
            } elseif (!$empleado->setCorreoEmpleado($_POST['correo_empleado'])) {
                $result['exception'] = 'Correo incorrecto';
            } elseif (!$empleado->setTelefonoEmpleado($_POST['telefono_empleado'])) {
                $result['exception'] = 'Teléfono incorrecto';
            } elseif ($empleado->actualizarEmpleado()) {
                $result['status'] = 1;
                $result['message'] = "Empleado actualizado correctamente";
            } else {
                $result['exception'] = database::obtenerProblema();
                $result['message'] = "Hubo un problema al ejecutar";
            }
            break;
        case "eliminarEmpleado":
            //Se cargan el identificador a eliminar
            if (!$empleado->setIdentificador($_POST['identificador_p'])) {
                $result['exception'] = 'Error al cargar el identificador del producto';
            } elseif ($empleado->eliminarEmpleado()) {
                $result['status'] = 1;
                $result['message'] = "Registro eliminado correctamente";
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case "buscar":
            //Se limpian los campos
            $_POST = $empleado->validarFormularios($_POST);
            //Se colocan los datos para buscar
            if (!$empleado->setBuscador($_POST['buscador'])) {
                $result['exception'] = 'Valor invalido en el buscador';
            } elseif (!$empleado->setCategoriaEmpleado($_POST['categoria'])) {
                $result['exception'] = 'El valor de la categoria no es valido';
            } elseif ($result['dataset'] = $empleado->buscar()) {
                $result['status'] = 1;
            } else {
                $result['message'] = database::obtenerProblema();
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
