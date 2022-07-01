<?php
// Modelo para comentarios


class catalogo extends Verificador
{

    /*
    * Declaración de variables globales para el modelo
    */

    private $textoBusqueda = null;
    private $categoria = null;
    private $filtro = null;
    private $identificador = null;


    /*
    * Métodos para guardar datos en las variables globales
    */

    public function setTextoBusqueda($valor)
    {
        if($this->validateString($valor,2,150))
        {
            $this->textoBusqueda = $valor;
            return true;
        }else{
            return false;
        }
    }

    public function setCategoria($valor)
    {
        if($this->validateNaturalNumber($valor))
        {
            $this->categoria = $valor;
            return true;
        }else{
            return false;
        }
    }
    public function setFiltro($valor)
    {
        if($this->validateNaturalNumber($valor))
        {
            $this->filtro = $valor;
            return true;
        }else{
            return false;
        }
    }


    public function setIdentificador($valor)
    {
        if ($this->validateNaturalNumber($valor)) {
            $this->identificador = $valor;
            return true;
        } else {
            return false;
        }
    }

    /*
    * Métodos para realizar los SCRUDS
    */

    //función para obtener 


}
