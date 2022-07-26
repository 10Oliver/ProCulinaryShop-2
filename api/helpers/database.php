<?php


/*
* Clase para operaciones con la base de datos
*/

class Database
{


    /*
    * Declración de las variable globales
    */

    private static $conexion = null;
    private static $ejecucion = null;
    private static $error = null;


    //Función para realizar la conexión con la base de datos

    public static function conectar()
    {
        //Variables con los datos para la conexión
        $servidor = 'localhost';
        $base_datos = 'ProCulinaryShop';
        $usuario = 'postgres';
        $contra = 'firearcher15'; //Contraseña se cambia según necesidades

        //Método que realizará la conexión mediante PDO y el controlador de PostgreSQL
        self::$conexion = new PDO('pgsql:host=' . $servidor . ';dbname= ' . $base_datos . '; port=5432', $usuario, $contra);

    }

    /*
    * Función que ejercuta sentencias con la base de datos.
    * 
    * Para su funcionamiento se necesita:
    * 
    * Sentencia: Sin los datos a utilizar
    *
    * Valores: Datos que se utilizarán para completar la sentencia
    *
    * Devuelve un valor de tipo booleano para determinar si se ejecutó correctamente o no
    *
    */

    public static function multiFilas($sentencia, $valores)
    {   
        try{
            //Abre la conexión
            self::conectar();
            //Agrega la sentencia a ejecutar
            self::$ejecucion = self::$conexion->prepare($sentencia);
            //Agregar los valores a la sentencia
            self::$ejecucion->execute($valores);
            //Se cierra la conexión con la base de datos
            self::$conexion = null;
            //Se devuelve el estado de la ejecución
            return self::$ejecucion->fetchAll(PDO::FETCH_ASSOC);
            
        }catch(PDOException $error){
            //En caso que la ejecución falle se da como negativa su ejecución
            self::obtenerCodigoError($error->getCode(), $error->getMessage());
            die(self::obtenerProblema());

        }
    }

    public static function filaUnica($sentencia, $valores)
    {
        try {
            //Se abrea la conexión
            self::conectar();
            //Agrega la sentencia a ejecutar
            self::$ejecucion = self::$conexion->prepare($sentencia);
            //Agregar los valores a la sentencia
            self::$ejecucion->execute($valores);
            //Se cierra la conexión con la base de datos
            self::$conexion = null;
            //Se devuelve el estado de la ejecución
            return self::$ejecucion->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $error) {
            //En caso que la ejecución falle se da como negativa su ejecución
            self::obtenerCodigoError($error->getCode(), $error->getMessage());
            die(self::obtenerProblema());
        }
    }

    public static function ejecutar($sentencia, $valores)
    {
        try{
             //Abre la conexión
            self::conectar();
            //Carga la sentencia a ejecutar
            self::$ejecucion = self::$conexion->prepare($sentencia);
            //Se agregan los paramentros a la sentencia y se ejecuta
            $estado = self::$ejecucion->execute($valores);
            //Se cierra la conexion
            self::$conexion = null;
            //Se devuelve el estado de la ejecución
            return $estado;
        }catch(PDOException $error){
            //Se obtiene el error y el mensaje de la excepcion
            self::obtenerCodigoError($error->getCode(),$error->getMessage());
            //Se devuelve como ejecución fallada
            return false;
        }
    }
        /*
    *   Método para establecer un mensaje de error personalizado al ocurrir una excepción.
    *
    *   Parámetros: $code (código del error) y $message (mensaje original del error).
    *
    *   Retorno: ninguno.
    */
    private static function obtenerCodigoError($code, $message)
    {
        // Se asigna el mensaje del error original por si se necesita.
        self::$error = utf8_encode($message);
        // Se compara el código del error para establecer un error personalizado.
        switch ($code) {
            case '7':
                self::$error = 'Existe un problema al conectar con el servidor';
                break;
            case '42703':
                self::$error = 'Nombre de campo desconocido';
                break;
            case '23505':
                //self::$error = 'Dato duplicado, no se puede guardar';
                break;
            case '42P01':
                self::$error = 'Nombre de tabla desconocido';
                break;
            case '23503':
                //self::$error = 'Registro ocupado, no se puede eliminar';
                break;
            default:
                //self::$error = 'Ocurrió un problema en la base de datos';
        }
    }

    //Método que obtiene el error
    public static function obtenerProblema()
    {
        return self::$error;
    }



}
?>