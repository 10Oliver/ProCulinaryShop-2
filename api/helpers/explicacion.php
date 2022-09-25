<?php


/**
 *     public function formatEmail($correo)
    {
        //Se recorta las primeras 3 líneas del correo
        $comienzo = substr($correo, 0, strlen($correo) - (strlen($correo) - 3));
        //Se extraen el dominio del correo
        $final = substr($correo, strripos($correo, '@') - strlen($correo));
        //Se obtiene el sobrante del correo para saber su longitud
        $restante = substr($correo, (strlen($correo) - (strlen($correo) - 3)), (strripos($correo, '@') - strlen($correo)));
        //Se le agregan asteríscos según la longitud del correo restante
        $total = str_pad($comienzo, strlen($restante) + 3, "*", STR_PAD_RIGHT);
        //Se une el todo para generar el nuevo formato de correo
        return $total . $final;
    }

 */

$correo = 'oliver.erazo1@gmail.com';

$division = strripos($correo, '@');

$inicio = substr($correo, 0, $division);

$punto = strripos($correo, '.');

$final = substr($correo, $division-1, $punto);

echo $inicio."<br>";
echo $final;