<?php

// Modelo para el inventario (Vista privada) y carrito (Vista pública)

class inventario extends Verificador
{
    //Variables generales para las operaciones SCRUD
    private $nombreProducto = null;
    private $cantidad = null;
    private $precio = null;
    private $descuento = null;
    private $descripcion = null;
    private $categoriaProducto = null;
    private $estadoProducto = null;
    private $materialProducto = null;
    private $imagenProducto = null;
    private $idProducto = null;
    private $idCliente = null;
    private $idDetalle = null;
    private $idOrden = null;
    private $buscador = null;
    private $ruta = '../images/productos/';



    //Funciones que llenan los datos globales

    public function setNombreProducto($valor)
    {
        if ($this->validateAlphanumeric($valor, 5, 80)) {
            $this->nombreProducto = $valor;
            return true;
        } else {
            return false;
        }
    }
    public function setBuscador($valor)
    {
        if ($this->validateAlphanumeric($valor, 0, 100)) {
            $this->buscador = "%$valor%";
            return true;
        } else {
            return false;
        }
    }

    public function setCantidad($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->cantidad = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setIdProducto($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->idProducto = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setIdCliente($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->idCliente = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setIdDetalle($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->idDetalle = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setPrecio($valor)
    {
        if ($this->validateMoney($valor)) {
            $this->precio = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setDescuento($valor)
    {
        if ($this->validateMoney($valor)) {
            $this->descuento = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setDescripcion($valor)
    {
        if ($this->validateString($valor, 5, 200)) {
            $this->descripcion = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setCategoriaProducto($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->categoriaProducto = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setEstadoProducto($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->estadoProducto = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setMaterialProducto($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->materialProducto = $valor;
            return true;
        } else {
            return false;
        }
    }

    public function setImagenProducto($valor)
    {
        if ($this->validateImageFile($valor, 1000, 1000)) {
            $this->imagenProducto = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    //Funciones que obtiene los datos de las variables

    public function getImagenProducto()
    {
        return $this->imagenProducto;
    }

    public function getRuta()
    {
        return $this->ruta;
    }

    public function getIdOrden()
    {
        return $this->idOrden;
    }


    /**
     *  Funciones que conectan con la base de datos
     * 
     *  Se dividirá en los apartados de la vista privada y pública
     * 
     */

    //----------Funciones de la vista privada----------\\


    //Función para cargar la tabla
    public function cargarDatos()
    {
        $sql = 'SELECT id_producto, nombre_producto, cantidad, descripcion, precio, descuento, imagen FROM producto
        WHERE id_estado_producto NOT IN (3) ORDER BY id_producto';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función para cargar las categorias
    public function cargarCategorias()
    {
        $sql = 'SELECT id_categoria, nombre_categoria FROM categoria';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función para cargar los materiales
    public function cargarMateriales()
    {
        $sql = 'SELECT * FROM material';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función para cargar los estados
    public function cargarEstados()
    {
        $sql = 'SELECT * FROM estado_producto';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //Función que crear un nuevo producto
    public function crearProducto()
    {
        $sql = 'INSERT INTO producto(
	 nombre_producto, cantidad, descripcion, precio, descuento, imagen, id_categoria, id_estado_producto, id_material, id_empleado)
	VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            $this->nombreProducto, $this->cantidad, $this->descripcion, $this->precio, $this->descuento,
            $this->imagenProducto, $this->categoriaProducto, $this->estadoProducto, $this->materialProducto, 1
        ); //Se deberia crear el $_SESSION['id_usuario']
        return database::ejecutar($sql, $params);
    }


    //Función que obtiene los datos antes de actualizar

    public function obtenerActualizar()
    {
        $sql = 'SELECT id_producto, nombre_producto, cantidad, descripcion, precio, descuento, imagen, id_categoria,
         id_estado_producto, id_material 	FROM producto WHERE id_producto = ?';
        $params = array($this->idProducto);
        return database::filaUnica($sql, $params);
    }

    //Función que actualizará un producto

    public function actualizarProducto($imagen_actual)
    {
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagenProducto) ? $this->deleteFile($this->getRuta(), $imagen_actual) : $this->imagenProducto = $imagen_actual;
        $sql = 'UPDATE producto
        SET nombre_producto=?, cantidad=?, descripcion=?, precio=?, descuento=?, imagen=?, id_categoria=?, id_estado_producto=?, id_material=?, id_empleado=?
        WHERE id_producto=?;';
        $params = array(
            $this->nombreProducto, $this->cantidad, $this->descripcion, $this->precio, $this->descuento,
            $this->imagenProducto, $this->categoriaProducto, $this->estadoProducto, $this->materialProducto, 1, $this->idProducto
        ); //Se deberia crear el $_SESSION['id_usuario']
        return database::ejecutar($sql, $params);
    }

    //función para eliminar un producto

    public function eliminarProducto()
    {
        $sql = 'UPDATE producto SET id_estado_producto = 3 WHERE id_producto = ?';
        $params = array($this->idProducto);
        return database::ejecutar($sql, $params);
    }

    //Función para buscar productos

    public function buscarProductos()
    {
        $sql = 'SELECT id_producto, nombre_producto, cantidad, descripcion, precio, descuento, imagen FROM producto
        WHERE id_estado_producto NOT IN (3) AND (nombre_producto ILIKE ? OR descripcion ILIKE ?) ORDER BY id_producto ';
        $params = array($this->buscador, $this->buscador);
        return database::multiFilas($sql, $params);
    }


    //----------Funciones de la vista pública----------\\

    //Función para cargar los productos en el carrito

    public function cargarCarrito()
    {
        $sql = 'SELECT deo.id_detalle_orden, p.imagen, p.nombre_producto, p.precio, deo.cantidad_producto_orden FROM detalle_orden deo
        INNER JOIN producto p ON p.id_producto = deo.id_producto 
        INNER JOIN orden_compra oc ON oc.id_orden_compra = deo.id_orden_compra
        WHERE id_cliente = ? AND id_estado_orden = 4 ORDER BY id_detalle_orden';
        $params = array($this->idCliente);
        return database::multiFilas($sql, $params);
    }

    //Función para obtener la cantidad actual del producto

    public function cantidadActual()
    {
        $sql = 'SELECT cantidad_producto_orden FROM detalle_orden WHERE id_detalle_orden = ?';
        $params = array($this->idDetalle);
        return intval(implode(database::filaUnica($sql, $params)));
    }

    //función para obtener la cantidad actual en el inventario
    public function cantidadActualInventario()
    {
        $sql = 'SELECT cantidad FROM producto WHERE id_producto = 
        (SELECT id_producto FROM detalle_orden WHERE id_detalle_orden = ?)';
        $params = array($this->idDetalle);
        return intval(implode(database::filaUnica($sql, $params)));
    }


    //función para obtener el ID del producto del inventario

    public function identificadorInventario()
    {
        $sql = 'SELECT id_producto FROM detalle_orden WHERE id_detalle_orden = ?';
        $params = array($this->idDetalle);
        return database::filaUnica($sql, $params);
    }

    //Función para verificar la existencia de un producto en el inventario
    public function cantidadInventario()
    {
        $sql = 'SELECT cantidad FROM producto WHERE id_producto = ?';
        $params = array($this->idProducto);
        return database::filaUnica($sql, $params);
    }

    //Función para disminuir la cantidad del producto en 1
    public function disminuir()
    {
        $sql = 'UPDATE detalle_orden SET cantidad_producto_orden = 
        (SELECT cantidad_producto_orden -1 FROM detalle_orden WHERE id_detalle_orden = ?)
        WHERE id_detalle_orden = ?';
        $params = array($this->idDetalle, $this->idDetalle);
        return database::ejecutar($sql, $params);
    }

    //Función para aumentar la cantidad del producto en 1
    public function aumentar()
    {
        $sql = 'UPDATE detalle_orden SET cantidad_producto_orden = 
        (SELECT cantidad_producto_orden +1 FROM detalle_orden WHERE id_detalle_orden = ?)
        WHERE id_detalle_orden = ?';
        $params = array($this->idDetalle, $this->idDetalle);
        return database::ejecutar($sql, $params);
    }

    //función para cargar la nueva cantidad en la orden
    public function cargarNuevaCantidad()
    {
        $sql = 'UPDATE detalle_orden SET cantidad_producto_orden = ?
        WHERE id_detalle_orden = ?';
        $params = array($this->cantidad, $this->idDetalle);
        return database::ejecutar($sql, $params);
    }

    //función para eliminar un producto del carrito de compras
    public function eliminarProductoCarrito()
    {
        $sql = 'DELETE FROM detalle_orden WHERE id_detalle_orden = ?';
        $params = array($this->idDetalle);
        return database::ejecutar($sql, $params);
    }

    //Función para eliminar todo el carrito()
    public function eliminarPedido()
    {
        $sql = 'DELETE FROM orden_compra WHERE id_orden_compra = 
        (SELECT id_orden_compra FROM orden_compra oc
        INNER JOIN cliente c ON oc.id_cliente = c.id_cliente
        WHERE oc.id_cliente = ? AND oc.id_estado_orden = 4)';
        $params = array($this->idCliente);
        return database::ejecutar($sql, $params);
    }

    //función para obtener las cantidades de los productos
    public function obtenerCantidades()
    {
        $sql = 'SELECT nombre_producto, cantidad, cantidad_producto_orden FROM producto p
        INNER JOIN detalle_orden deo ON p.id_producto = deo.id_producto
        WHERE id_orden_compra = (SELECT id_orden_compra FROM orden_compra oc
        INNER JOIN cliente c ON oc.id_cliente = c.id_cliente
        WHERE oc.id_cliente = ? AND oc.id_estado_orden = 4)';
        $params = array($this->idCliente);
        return database::multiFilas($sql, $params);
    }

    //función para completar compra

    public function completarCompra()
    {
        $sql = 'call completar_compra (?)';
        $params = array($this->idCliente);
        return database::ejecutar($sql, $params);
    }

    /*----------- detalle (pública)-------------- */

    //función para cargar los datos de un producto

    public function cargarProducto()
    {
        $sql = 'SELECT id_producto, imagen, nombre_producto, descripcion, cantidad, precio, m.material, c.nombre_categoria FROM producto p
        INNER JOIN categoria c ON p.id_categoria = c.id_categoria
        INNER JOIN material m ON m.id_material = p.id_material
        WHERE id_producto = ?';
        $params = array($this->idProducto);
        return database::filaUnica($sql, $params);
    }

    //función para verificar si existen una compra en proceso

    public function compraActiva()
    {
        $sql = 'SELECT id_orden_compra FROM orden_compra WHERE id_cliente = ? AND id_estado_orden = 4';
        $params = array($this->idCliente);
        if ($datos = database::filaUnica($sql, $params)) {
            $this->idOrden = $datos['id_orden_compra'];
            return $datos;
        }
    }


    //función para obtener los comentarios

    public function comentarios()
    {
        $sql = 'SELECT  resena, calificacion, nombre_cliente FROM resena r
		INNER JOIN detalle_orden deo ON r.id_detalle_orden = deo.id_detalle_orden
		INNER JOIN orden_compra oc ON oc.id_orden_compra = deo.id_orden_compra
		INNER JOIN cliente c ON c.id_cliente = oc.id_cliente
		WHERE id_producto = ?';
        $params = array($this->idProducto);
        return database::multiFilas($sql, $params);
    }

    //función para crear una nueva orden

    public function crearOrden()
    {

        $sql = 'CALL crear_orden(?,?,?,?,?);';
        $params = array($this->idCliente, 1, date('Y-m-d'), '{{' . $this->cantidad . ',' . $this->idProducto . '}}', 1);
        return database::ejecutar($sql, $params);
    }

    //función para obtener si el producto está presente

    public function verificarExistencia()
    {
        $sql = 'SELECT id_producto FROM detalle_orden WHERE id_producto = ? AND id_orden_compra = ? LIMIT 1';
        $params = array($this->idProducto, $this->idDetalle);
        $dato = database::filaUnica($sql, $params);
        if (!empty($dato)) {
            return $dato;
        } else {
            return array(false);
        }
    }

    //función para actualizar la cantidad en el carrito

    public function actualizarExistencia()
    {
        $sql = 'UPDATE detalle_orden SET cantidad_producto_orden = (SELECT cantidad_producto_orden FROM detalle_orden WHERE id_producto = ? AND id_orden_compra = ?)+? WHERE id_producto = ? AND id_orden_compra = ?';
        $params = array($this->idProducto, $this->idDetalle, $this->cantidad, $this->idProducto, $this->idDetalle);
        return database::ejecutar($sql, $params);
    }

    //función para agregar un producto a la orden en proceso

    public function agregarProducto()
    {
        $sql = 'INSERT INTO detalle_orden (cantidad_producto_orden, precio_producto_orden, id_producto, id_orden_compra)
        VALUES (?,(SELECT precio FROM producto WHERE id_producto = ?),?,?)';
        $params = array($this->cantidad, $this->idProducto, $this->idProducto, $this->idDetalle);
        return database::ejecutar($sql, $params);
    }

    /*-------------------------- Cátalogo (Pública) ---------------------------- */

    //función para obtener todos los productos

    public function buscarTodo()
    {
        $sql = 'SELECT id_producto, nombre_producto, precio, imagen FROM producto WHERE id_estado_producto = 1 AND cantidad > 0
        ORDER BY id_producto';
        $params = null;
        return database::multiFilas($sql, $params);
    }

    //función para obtener los productos según 
    public function buscarEspecifico()
    {
        $sql = 'SELECT id_producto, nombre_producto, precio, imagen FROM producto WHERE id_estado_producto = 1 AND cantidad > 0
        AND nombre_producto ILIKE ? ORDER BY id_producto';
        $params = array($this->buscador);
        return database::multiFilas($sql, $params);
    }

    //Función para obtener el detalle del producto
    public function factura()
    {
        $sql = 'SELECT p.nombre_producto, deo.cantidad_producto_orden, deo.precio_producto_orden,
        (deo.cantidad_producto_orden * deo.precio_producto_orden) AS subtotal FROM detalle_orden deo
        INNER JOIN producto p ON p.id_producto = deo.id_producto
        WHERE deo.id_orden_compra = (SELECT MAX (id_orden_compra) FROM orden_compra WHERE id_cliente = ? AND id_estado_orden = 2)';
        $params = array($this->idCliente);
        return database::multiFilas($sql, $params);
    }
}
