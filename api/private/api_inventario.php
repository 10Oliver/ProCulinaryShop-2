<?php
//Se importan los archivos necesarios
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
    //Se instancia la clase correspondiente en la variable
    $inventario = new inventario;
    //Se crea un vector con los datos para crear el mensaje (Se devuelve al controllador)
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'exception' => null);
    //Se debería crear un método para confirmar si el usuario tiene permitido, todavía en cuestionamiento
    // Elección del proceso a realizar
    switch ($_GET['action']) {
        case 'cargarDatos':
            //Carga los datos en la tabla
            if ($result['dataset'] = $inventario->cargarDatos()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargarCategoria':
            if ($result['dataset'] = $inventario->cargarCategorias()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargarEstados':
            if ($result['dataset'] = $inventario->cargarEstados()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'cargarMaterial':
            if ($result['dataset'] = $inventario->cargarMateriales()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = 'No hay datos de momento';
            }
            break;
        case 'guardarProducto':
            $_POST = $inventario->validarFormularios($_POST);
            if (!$inventario->setNombreProducto($_POST['nombre_producto'])) {
                $result['exception'] = 'nombre de producto invalido';
            } elseif (!$inventario->setPrecio($_POST['precio_producto'])) {
                $result['exception'] = 'Precio del producto invalido';
            } elseif (!$inventario->setCantidad($_POST['cantidad'])) {
                $result['exception'] = 'Cantidad invalidad';
            } elseif (!$inventario->setDescuento($_POST['descuento'])) {
                $result['exception'] = 'Descuento invalido';
            } elseif (!$inventario->setDescripcion($_POST['descripcion_producto'])) {
                $result['exception'] = 'Descripcion invalida';
            } elseif (!$inventario->setCategoriaProducto($_POST['categoria_producto'])) {
                $result['exception'] = 'Categoria invalida';
            } elseif (!$inventario->setEstadoProducto($_POST['estado_producto'])) {
                $result['exception'] = 'Estado del producto invalido';
            } elseif (!$inventario->setMaterialProducto($_POST['material_producto'])) {
                $result['exception'] = 'Material invalido';
            } elseif (!$inventario->setImagenProducto($_FILES['imagen_producto'])) {
                $result['exception'] = $inventario->getFileError();
            } elseif ($inventario->crearProducto()) {
                $result['status'] = 1;
                if ($inventario->saveFile($_FILES['imagen_producto'], $inventario->getRuta(), $inventario->getImagenProducto())) {
                    $result['message'] = 'Producto creado correctamente';
                } else {
                    $result['message'] = 'Producto creado pero no se guardó la imagen';
                }
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'obtenerActualizar':
            if (!$inventario->setIdProducto($_POST['identificador_p'])) {
                $result['exception'] = "El producto cargado no se pueda usar";
            } elseif ($result['dataset'] = $inventario->obtenerActualizar()) {
                $result['status'] = 1;
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = "El producto no existe";
            }
            break;
        case 'modificarProducto':
            $_POST = $inventario->validarFormularios($_POST);
            if (!$inventario->setIdProducto($_POST['identificadorM'])) {
                $result['exception'] = 'El producto a actualizar no se pudo cargar';
            } elseif (!$data = $inventario->obtenerActualizar()) {
                $result['exception'] = 'Producto inexistente';
            } elseif (!$inventario->setNombreProducto($_POST['nombre_productoM'])) {
                $result['exception'] = 'nombre de producto invalido';
            } elseif (!$inventario->setPrecio($_POST['precio_productoM'])) {
                $result['exception'] = 'Precio del producto invalido';
            } elseif (!$inventario->setCantidad($_POST['cantidadM'])) {
                $result['exception'] = 'Cantidad invalidad';
            } elseif (!$inventario->setDescuento($_POST['descuentoM'])) {
                $result['exception'] = 'Descuento invalido';
            } elseif (!$inventario->setDescripcion($_POST['descripcion_productoM'])) {
                $result['exception'] = 'Descripcion invalida';
            } elseif (!$inventario->setCategoriaProducto($_POST['categoria_productoM'])) {
                $result['exception'] = 'Categoria invalida';
            } elseif (!$inventario->setEstadoProducto($_POST['estado_productoM'])) {
                $result['exception'] = 'Estado del producto invalido';
            } elseif (!$inventario->setMaterialProducto($_POST['material_productoM'])) {
                $result['exception'] = 'Material invalido';
            } elseif (!is_uploaded_file($_FILES['imagen_productoM']['tmp_name'])) {
                if ($inventario->actualizarProducto($data['imagen'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto modificado correctamente';
                } else {
                    $result['exception'] = database::obtenerProblema();
                }
            } elseif (!$inventario->setImagenProducto($_FILES['imagen_productoM'])) {
                $result['exception'] = $inventario->getFileError();
            } elseif ($inventario->actualizarProducto($data['imagen'])) {
                $result['status'] = 1;
                if ($inventario->saveFile($_FILES['imagen_productoM'], $inventario->getRuta(), $inventario->getImagenProducto())) {
                    $result['message'] = 'Producto modificado correctamente';
                } else {
                    $result['message'] = 'Producto modificado pero no se guardó la imagen';
                }
            } else {
                $result['exception'] = database::obtenerProblema();
            }
            break;
        case 'eliminarProducto':
            if (!$inventario->setIdProducto($_POST['identificador_p'])) {
                $result['exception'] = "El producto cargado no se pueda usar";
            } elseif ($result['dataset'] = $inventario->eliminarProducto()) {
                $result['status'] = 1;
                $result['message'] = "Producto eliminado correctamente";
            } elseif (database::obtenerProblema()) {
                $result['exception'] = database::obtenerProblema();
            } else {
                $result['exception'] = "El producto no existe";
            }
            break;
        case 'buscar':
            $_POST = $inventario->validarFormularios($_POST);
            if (!$inventario->setBuscador($_POST['buscador'])) {
                $result['exception'] = 'El valor a buscar no es valido';
            } elseif ($result['dataset'] = $inventario->buscarProductos()) {
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
