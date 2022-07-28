
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
    //Se escoge el proceso que se ejecutará en el modelo
    switch ($_GET['action']) {
        case 'cargarProducto':
            if (!$inventario->setIdProducto($_POST['identificador'])) {
                $result['exception'] = 'No se encontró el producto a ver';
            } elseif ($result['dataset'] = $inventario->cargarProducto()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
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
        case 'cantidad':
            if (!$inventario->setIdCliente($_SESSION['id_cliente'])) {
                $result['exception'] = 'Debes iniciar sesión para agregar productos al carrito';
                $result['status'] = 2;
            } elseif (!$inventario->setIdProducto($_POST['identificador'])) {
                $result['exception'] = 'No se logró cargar el producto a agregar';
            } elseif ($result['dataset'] = $inventario->cantidadInventario()) {
                $result['status'] = 1;
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'activo':
            if (!$inventario->setIdCliente($_SESSION['id_cliente'])) //Debería ser el id de $_SESSION
            {
                $result['exception'] = 'No se logró obtener tu estado de compra';
            } elseif ($result['dataset'] = $inventario->compraActiva()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['status'] = 2;
            }
            break;
        case 'agregarProducto':
            if (!$inventario->setCantidad($_POST['cantidad'])) {
                $result['exception'] = 'No se logró cargar la cantidad a ingresar';
            } elseif (!$inventario->setIdProducto($_POST['producto'])) {
                $result['exception'] = 'No se logró cargar el identificador del producto';
            } elseif (!$inventario->setIdDetalle($_POST['identificador'])) {
                $result['exception'] = 'No se logró cargar tu orden';
            } elseif ((implode("", $inventario->verificarExistencia())) == $_POST['producto']) {
                if ($inventario->actualizarExistencia()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto agregado correctamente (Actualizado)';
                } else {
                    $result['exception'] = 'problema';
                }
            } elseif ($inventario->agregarProducto()) {

                $result['status'] = 1;
                $result['message'] = 'Producto agregado correctamente (agregado)';
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'crearOrden':
            $_POST = $inventario->validarFormularios($_POST);
            if (!$inventario->setIdCliente($_SESSION['id_cliente'])) {
                $result['exception'] = 'No se logró identificar tu usuario';
            } elseif (!$inventario->setCantidad($_POST['cantidad'])) {
                $result['exception'] = 'No se logró cargar la cantidad a añadir';
            } elseif (!$inventario->setIdProducto($_POST['producto'])) {
                $result['exception'] = 'No se logró cargar el producto a cargar';
            } elseif ($inventario->crearOrden()) {
                $result['status'] = 1;
                $result['message'] = 'Producto agregado correctamente (creado)';
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'obtenerComentarios':
            if (!$inventario->setIdProducto($_POST['producto'])) {
                $result['exception'] = 'No se logró identificar el producto';
            } elseif ($result['dataset'] = $inventario->comentarios()) {
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


?>