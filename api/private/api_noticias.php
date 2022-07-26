<?php

//Se importan los archivos necesarios
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

    //Se debería crear un método para confirmar si el usuario tiene permitido, todavía en cuestionamiento
    // Elección del proceso a realizar
    switch ($_GET['action']) {
        case 'cargar_datos':
            //Carga los datos en la tabla
            if ($result['dataset'] = $noticia->cargarDatos()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargar_categorias':
            if ($result['dataset'] = $noticia->cargarCategorias()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargar_tipos':
            if ($result['dataset'] = $noticia->cargarTipos()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargar_productos':
            if ($result['dataset'] = $noticia->cargarProductos()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargar_estados':
            if ($result['dataset'] = $noticia->cargarEstados()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case "guardar_noticia":
            $_POST = $noticia->validarFormularios($_POST);
            if (!$noticia->setTitulo($_POST['titulo_noticia'])) {
                $result['exception'] = "Titulo incorrecto";
            } elseif (!$noticia->setDescripcion($_POST['descripcion_noticia'])) {
                $result['exception'] = "Descripción incorrecta";
            } elseif (!$noticia->setFechaFinal($_POST['fecha_final'] . " 00:00:00")) {
                $result['exception'] = "Fecha de finalización incorrecta";
            } elseif (!$noticia->setTipoNoticia($_POST['tipo_noticia'])) {
                $result['exception'] = "Tipo de noticia incorrecto";
            } elseif (!$noticia->setProducto($_POST['productos_select'])) {
                $result['exception'] = 'Producto incorrecto';
            } elseif (!$noticia->setDescuento($_POST['descuento'])) {
                $result['exception'] = 'Descuento incorrecto';
            } elseif ($noticia->guardarNoticia()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'obtener_actualizar':
            $_POST = $noticia->validarFormularios($_POST);
            if (!$noticia->setIdentificador($_POST['identificador_p'])) {
                $result['exception'] = 'No se encontró el producto a modificar';
            } elseif ($result['dataset'] = $noticia->preCargar()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'actualizar_noticia':
            $_POST = $noticia->validarFormularios($_POST);
            if (!$noticia->setIdentificador($_POST['identificadorM'])) {
                $result['exception'] = 'No se logró cargar el producto a modificar';
            } elseif (!$noticia->setTitulo($_POST['titulo_noticiaM'])) {
                $result['exception'] = "Titulo incorrecto";
            } elseif (!$noticia->setDescripcion($_POST['descripcion_noticiaM'])) {
                $result['exception'] = "Descripción incorrecta";
            } elseif (!$noticia->setFechaFinal($_POST['fecha_finalM'])) {
                $result['exception'] = "Fecha de finalización incorrecta";
            } elseif (!$noticia->setTipoNoticia($_POST['tipo_noticiaM'])) {
                $result['exception'] = "Tipo de noticia incorrecto";
            } elseif (!$noticia->setEstadoNoticia($_POST['estado_noticiaM'])) {
                $result['exception'] = "Estado incorrecto";
            } elseif (!$noticia->setProducto($_POST['productos_selectM'])) {
                $result['exception'] = 'Producto incorrecto';
            } elseif (!$noticia->setDescuento($_POST['descuentoM'])) {
                $result['exception'] = 'Descuento incorrecto';
            } elseif ($noticia->actualizarNoticia()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'eliminar_noticia':
            if (!$noticia->setIdentificador($_POST['identificador_p'])) {
                $result['exception'] = 'No se cargó la noticia a eliminar';
            } elseif ($noticia->eliminarNoticia()) {
                $result['status'] = 1;
                $result['message'] = 'Noticia eliminada exitosamente';
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'buscar':
            if ($result['dataset'] = $noticia->buscar($_POST['buscador'], $_POST['categoria'])) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargarNoticias':
            if (!$noticia->setFechaInicial($_POST['fechainicial'])) {
                $result['exception'] = 'Fecha inicial incorrecta';
            } elseif (!$noticia->setFechaFinal($_POST['fechafinal'])) {
                $result['exception'] = 'Fecha final incorrecta';
            } elseif ($result['dataset'] = $noticia->obtenerDatos()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'reporte':
            if ($result['dataset'] = $noticia->reporte()) {
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
