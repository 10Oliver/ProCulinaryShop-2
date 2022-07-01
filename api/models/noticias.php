<?php


class noticia extends Verificador{

    /**
     * Variables globales
     */

     private $identificador = null;
     private $titulo = null;
     private $descripcion = null;
     private $estadoNoticia = null;
     private $tipoNoticia = null;
     private $fechaFinal = null;
     private $producto = null;
     private $descuento = null;


     /**
      * Métodos para darles valor a las variables globales
      */

      public function setIdentificador($valor)
      {
          if($this->validateNaturalNumber($valor))
          {
              $this->identificador = $valor;
              return true;
          }else{
              return false;
          }
      }
      
       public function setTitulo($valor)
      {
          if($this->validateAlphanumeric($valor, 10, 100))
          {
              $this->titulo = $valor;
              return true;
          }else{
              return false;
          }
      }

       public function setDescripcion($valor)
      {
          if($this->validateString($valor,20, 400))
          {
              $this->descripcion = $valor;
              return true;
          }else{
              return false;
          }
      }

       public function setFechaFinal($valor)
      {
          if($this->validarFecha($valor))
          {
              $this->fechaFinal = $valor;
              return true;
          }else{
              return false;
          }
      }

       public function setEstadoNoticia($valor)
      {
          if($this->validateNaturalNumber($valor))
          {
              $this->estadoNoticia = $valor;
              return true;
          }else{
              return false;
          }
      }

       public function setTipoNoticia($valor)
      {
          if($this->validateNaturalNumber($valor))
          {
              $this->tipoNoticia = $valor;
              return true;
          }else{
              return false;
          }
      }

       public function setProducto($valor)
      {
          if($this->validateNaturalNumber($valor))
          {
              $this->producto = $valor;
              return true;
          }else{
              return false;
          }
      }

       public function setDescuento($valor)
      {
          if($this->validateMoney($valor))
          {
              $this->descuento = $valor;
              return true;
          }else{
              return false;
          }
      }

      /**
       * Funciones que conectarán con la DB
       */


       /*---------- Noticias (privada)---------- */


       //Función que carga los datos de la tabla
       public function cargarDatos()
       {
           $sql = 'SELECT id_noticia, p.nombre_producto,p.imagen, titulo_noticia, descripcion_noticia, n.descuento FROM noticia n
            INNER JOIN producto p ON p.id_producto = n.id_producto WHERE id_estado_noticia NOT IN (3)';
            $params = null;
            return database::multiFilas($sql, $params);
       }

       //Función que carga las categorias
       public function cargarCategorias()
       {
            $sql = 'SELECT id_categoria, nombre_categoria FROM categoria';
            $params = null;
            return database::multiFilas($sql, $params);
       }

       //Función para cargar los producto
       public function cargarProductos()
       {
           $sql = 'SELECT id_producto, nombre_producto FROM producto';
           $params = null;
           return database::multiFilas($sql,$params);
       }

       //Función para cargar los tipos de noticias

       public function cargarTipos()
       {
           $sql = 'SELECT * FROM tipo_noticia';
           $params = null;
           return database::multiFilas($sql,$params);
       }

       //Función para cargar los estados de las noticias

       public function cargarEstados()
       {
           $sql = 'SELECT * FROM estado_noticia WHERE id_estado_noticia NOT IN (3)';
           $params = null;
           return database::multiFilas($sql,$params);
       }

       //Función para crear una nueva noticia

       public function guardarNoticia()
       {
           $sql = 'INSERT INTO noticia (titulo_noticia,descripcion_noticia, fecha_final,id_estado_noticia, 
           id_tipo_noticia, id_producto, descuento) VALUES  (?, ?, ?, ?, ?, ?, ?)';
           $params = array( $this->titulo, $this->descripcion,  $this->fechaFinal, 1,
            $this->tipoNoticia,  $this->producto, $this->descuento);
           return database::ejecutar($sql, $params);
       }

       //Función que obtiene los datos para pre-cargarlos
       public function preCargar()
       {
           $sql = 'SELECT id_noticia, titulo_noticia, descripcion_noticia, fecha_final, n.descuento, id_tipo_noticia, id_estado_noticia, p.id_producto FROM noticia n
           INNER JOIN producto p ON p.id_producto = n.id_producto WHERE id_noticia = ?';
           $params = array($this->identificador);
           return database::filaUnica($sql, $params);
       }

       //Función que actualizará los datos de una noticia
       public function actualizarNoticia()
       {
           $sql = 'UPDATE noticia SET titulo_noticia = ?, descripcion_noticia = ?, fecha_final = ?,
           id_estado_noticia = ?, id_tipo_noticia = ?, id_producto = ?, descuento = ?
           WHERE id_noticia = ?';
           $params = array($this->titulo, $this->descripcion, $this->fechaFinal, $this->estadoNoticia,
           $this->tipoNoticia, $this->producto, $this->descuento, $this->identificador);
           return database::ejecutar($sql, $params);
       }

       //Función que "Eliminará" la noticia
       public function eliminarNoticia()
       {
           $sql = 'UPDATE noticia SET id_estado_noticia = 3 WHERE id_noticia = ?';
           $params = array($this->identificador);
           return database::ejecutar($sql, $params);
       }

       //Función para buscar noticias por el 

       public function buscar($buscador, $categoria){
        $sql = 'SELECT id_noticia,p.nombre_producto, titulo_noticia, descripcion_noticia, fecha_final, n.descuento, id_tipo_noticia, id_estado_noticia, p.id_producto FROM noticia n
        INNER JOIN producto p ON p.id_producto = n.id_producto
        WHERE (titulo_noticia ILIKE ? OR descripcion_noticia ILIKE ? OR p.nombre_producto ILIKE ?)';
        $params = array("%$buscador%","%$buscador%","%$buscador%");
        if($categoria!=0){
            $sql .= ' AND p.id_categoria = ? ';
            array_push($params, $categoria);
        }
        $sql .= ' ORDER BY id_noticia';
       
        return database::multiFilas($sql,$params);
    }

    /*------------ index (pública)---------------- */

    public function cargarNoticias()
    {
        $sql = 'SELECT titulo_noticia, descripcion_noticia, id_tipo_noticia, p.imagen, p.id_producto, n.descuento FROM noticia n
        INNER JOIN producto p ON n.id_producto = p.id_producto
        WHERE id_estado_noticia = 1 AND fecha_final >= current_date AND p.cantidad > 0';
        $params = null;
        return database::multiFilas($sql, $params);
    }
}
