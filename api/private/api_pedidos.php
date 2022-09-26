<?php

//Se importan los archivos necesarios
require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/pedido.php');


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
    $pedido = new Pedido;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);

    //Se debería crear un método para confirmar si el usuario tiene permitido, todavía en cuestionamiento
    // Elección del proceso a realizar
    switch ($_GET['action']) {
        case 'cargarDatos':
            //Carga los datos en la tabla
            if ($result['dataset'] = $pedido->cargarDatos()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargarEstados':
            //Llena el SELECT de los estados disponibles
            if ($result['dataset'] = $pedido->cargarEstados()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = "No existen datos de momento";
            }
            break;
        case 'actualizarEstado':
            if (!$pedido->setEstado($_POST['estado'])) {
                $result['exception'] = "Error al cargar el nuevo estado";
            } elseif (!$pedido->setIden($_POST['identificador_p'])) {
                $result['exception'] = "Error al verificar el pedido a actualizar";
            } elseif ($result['dataset'] = $pedido->actualizarEstados()) {
                $result['status'] = '1';
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'eliminarPedido':
            if (!$pedido->setIden($_POST['identificador_p'])) {
                $result['exception'] = "Error al verificar el pedido a actualizar";
            } elseif ($result['dataset'] = $pedido->eliminarPedidos()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'buscar':
            //Se limpian los campos
            $_POST = $pedido->validarFormularios($_POST);
            //Se colocan los datos para buscar
            if (!$pedido->setBuscador($_POST['buscador'])) {
                $result['exception'] = 'Valor invalido en el buscador';
            } elseif (!$pedido->setFiltro($_POST['categoria'])) {
                $result['exception'] = 'El valor de la categoria no es valido';
            } elseif ($result['dataset'] = $pedido->buscarPedidos()) {
                $result['status'] = 1;
            } else {
                $result['message'] = database::obtenerProblema();
            }
            break;
        case "lista":
            $_POST = $pedido->validarFormularios($_POST);
            if (!$pedido->setIden($_POST['identificador_p'])) {
                $result['exception'] = "Error al cargar el pedido indicado";
            } elseif ($result['dataset'] = $pedido->cargarLista()) {
                $result['status'] = 1;
            } else {
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
