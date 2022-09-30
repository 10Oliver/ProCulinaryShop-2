<?php

//Se incluyen la librería para activar la autentificación
require_once "../libraries/autenticator/autenticator.php";

class Autentificador extends PHPGangsta_GoogleAuthenticator{

     //Función para crear el secreto que unirá la aplicación con el usuario
     public function secretGenerator()
     {
         $secreto = $this->createSecret();
         //Se guarda el secreto en la sesión temporalmente
         $_SESSION['identificador'] = $secreto;
         //Se retorna un arreglo con la url del código y el secreto por escrito
         return $this->qrGenerator($secreto);
     }
 
     //Función para generar un códigoQR
     public function qrGenerator($clave)
     {
        //Se crea el arreglo donde se guardarán las cosas
         $contenedor = array();
         //Se guarda el código por escrito
         array_push($contenedor, $clave);
         //Se crea el código QR (URL)
         $codigoQR = $this->getQRCodeGoogleUrl('ProCulinaryShop', $clave);
         //Se guarda el código
         array_push($contenedor, $codigoQR);
         return $contenedor;
     }
 
    /**
     * Función para verificar que el código ingresado por el usuario
     * sea el que realmente está generando la aplicación
     * 
     * $usuario = Token secreto enlazado con el usuario
     * $valor = Token ingresado por el usuario
    */
     public function validateCode($usuario, $valor)
     {
         if ($this->verifyCode($usuario, $valor)) {
             return true;
         } else {
             return false;
         }
     }
}