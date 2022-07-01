<?php
//Se importan los archivos necesarios

use LDAP\Result;

require_once('../helpers/database.php');
require_once('../helpers/verificador.php');
require_once('../models/inventario.php');


/*
    * Comprobación para la acción que se realizará usando los métodos del modelo
    * de empleado y ejecutados en database.php
    *
    * La acción se recibirá del controlador
    */
if (isset($_GET['action'])) {
    //Se crea o reiniciar una sesión
    session_start();
    if ($_SESSION['id_cliente'] == null) {
        $_SESSION['id_cliente'] = 'No conectado';
    }
    //Se instancia la clase correspondiente en la variable
    $inventario = new inventario;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Se debería crear un método para confirmar si el usuario tiene permitido, todavía en cuestionamiento
    // Elección del proceso a realizar
    switch ($_GET['action']) {
        case 'cargarDatos':
            if (!$inventario->setIdCliente(($_SESSION['id_cliente']))) //Se debería enviar el ID de $_SESSION()
            {
                $result['exception'] = 'Debes iniciar sesión para ver los productos';
            } elseif ($result['dataset'] = $inventario->cargarCarrito()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No se han ingresado productos al carrito';
            }
            break;
        case 'disminuirSecuencia':
            if (!$inventario->setIdDetalle($_POST['identificador'])) {
                $result['exception'] = 'No se encontró el producto a disminuir';
            } elseif ($inventario->disminuir()) {
                if ($result['dataset'] = $inventario->cantidadActual()) {
                    $result['status'] = 1;
                } else {
                    $result['exception'] = 'No se logró recuperar la cantidad';
                }
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'aumentarSecuencia':
            if (!$inventario->setIdDetalle($_POST['identificador'])) {
                $result['exception'] = 'No se encontró el producto a disminuir';
            } elseif ($inventario->cantidadActual() + 1 <= $inventario->cantidadActualInventario()) {
                if ($inventario->aumentar()) {
                    if ($result['dataset'] = $inventario->cantidadActual()) {
                        $result['status'] = 1;
                    } else {
                        $result['exception'] = 'No se logró recuperar la cantidad';
                    }
                }
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'La cantidad solicitada supera la cantidad del inventario';
            }
            break;
        case 'CantidadManual':
            $_POST = $inventario->validarFormularios($_POST);
            if (!$inventario->setIdDetalle($_POST['identificador'])) {
                $result['exception'] = 'La cantidad solicitada no pudo ser cargada';
            } elseif ($inventario->cantidadActualInventario() < intval($_POST['cantidad'])) {
                $result['exception'] = 'La cantidad solicitada es superior a las existencias';
                $result['dataset'] = $inventario->cantidadActual();
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['status'] = 1;
            }
            break;
        case 'colocarManual':
            $_POST = $inventario->validarFormularios($_POST);
            if (!$inventario->setCantidad($_POST['cantidad'])) {
                $result['exception'] = 'No se logró cargar la nueva cantidad';
            } elseif (!$inventario->setIdDetalle($_POST['identificador'])) {
                $result['exception'] = 'No se logró cargar el productos a actualizar';
            } elseif ($inventario->cargarNuevaCantidad()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'EliminarProductoCarrito':
            if (!$inventario->setIdDetalle($_POST['identificador'])) {
                $result['exception'] = 'No se cargó el producto seleccionado';
            } elseif ($inventario->eliminarProductoCarrito()) {
                $result['status'] = 1;
                $result['message'] = 'Producto eliminado del carrito correctamente';
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'eliminarPedidoTotal':
            if (!$inventario->setIdCliente($_SESSION['id_cliente'])) { 
                $result['exception']  = 'No se logró cargar el pedido a eliminar';
            } elseif ($inventario->eliminarPedido()) {
                $result['status'] = 1;
                $result['message'] = 'Pedido eliminado correctamente';
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'ObtenerCantidades':
            if (!$inventario->setIdCliente($_SESSION['id_cliente'])) {
                $result['exception'] = 'No se encontró el pedido para su verificación';
            }elseif($result['dataset'] = $inventario->obtenerCantidades()){
                $result['status'] = 1;
            }else{
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'completarPedido':
            if (!$inventario->setIdCliente($_SESSION['id_cliente'])) {
                $result['exception'] = 'Hubo un problema al identificar tu compra';
            } elseif ($inventario->completarCompra()) {
                $result['status'] = 1;
                $result['message'] = 'Tu compra ha sido completada con éxito';
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
