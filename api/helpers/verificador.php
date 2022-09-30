<?php

/*
* Clase que se encarga de validar los datos de las vistas hacia los modelos
*/

class Verificador
{


    // Propiedades para manejar algunas validaciones.
    private $passwordError = null;
    private $fileError = null;
    private $fileName = null;
    private $exception = null;

    /*
    *   Método para obtener el error al validar una contraseña.
    */
    public function getPasswordError()
    {
        return $this->passwordError;
    }

        /*
    *   Método para obtener el error al validar un campo.
    */
    public function getException()
    {
        return $this->exception;
    }

    /*
    *   Método para obtener el nombre del archivo validado previamente.
    */
    public function getFileName()
    {
        return $this->fileName;
    }

    /*
    *   Método para obtener el error al validar un archivo.
    */
    public function getFileError()
    {
        return $this->fileError;
    }


    /*
    * Función que recibe los datos de los formularios y elimina los 
    * espacios en blanco.
    * 
    * Devuelve los campos limpios de los espacios en blanco
     */
    public function validarFormularios($campos)
    {
        foreach ($campos as $linea => $limpiar) {
            $limpiar = trim($limpiar);
            $campos[$linea] = $limpiar;
        }
        return $campos;
    }


    /*
    *   Método para validar un archivo de imagen.
    *
    *   Parámetros: $file (archivo de un formulario), $maxWidth (ancho máximo para la imagen) y $maxHeigth (alto máximo para la imagen).
    *   
    *   Retorno: booleano (true si el archivo es correcto o false en caso contrario).
    */
    public function validateImageFile($file, $maxWidth, $maxHeigth)
    {
        // Se verifica si el archivo existe, de lo contrario se establece el mensaje de error correspondiente.
        if ($file) {
            // Se comprueba si el archivo tiene un tamaño menor o igual a 2MB, de lo contrario se establece el mensaje de error correspondiente.
            if ($file['size'] <= 2097152) {
                // Se obtienen las dimensiones de la imagen y su tipo.
                list($width, $height, $type) = getimagesize($file['tmp_name']);
                // Se verifica si la imagen cumple con las dimensiones máximas, de lo contrario se establece el mensaje de error correspondiente.
                if ($width <= $maxWidth && $height <= $maxHeigth) {
                    // Se comprueba si el tipo de imagen es permitido (2 - JPG y 3 - PNG), de lo contrario se establece el mensaje de error correspondiente.
                    if ($type == 2 || $type == 3) {
                        // Se obtiene la extensión del archivo y se convierte a minúsculas.
                        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                        // Se establece un nombre único para el archivo.
                        $this->fileName = uniqid() . '.' . $extension;
                        return true;
                    } else {
                        $this->fileError = 'El tipo de imagen debe ser jpg o png';
                        return false;
                    }
                } else {
                    $this->fileError = 'La dimensión de la imagen es incorrecta';
                    return false;
                }
            } else {
                $this->fileError = 'El tamaño de la imagen debe ser menor a 2MB';
                return false;
            }
        } else {
            $this->fileError = 'El archivo de la imagen no existe';
            return false;
        }
    }



    /*
    *   Método para validar la ubicación de un archivo antes de subirlo al servidor.
    *
    *   Parámetros: $file (archivo), $path (ruta del archivo) y $name (nombre del archivo).
    *   
    *   Retorno: booleano (true si el archivo fue subido al servidor o false en caso contrario).
    */
    public function saveFile($file, $path, $name)
    {
        // Se comprueba que la ruta en el servidor exista.
        if (file_exists($path)) {
            // Se verifica que el archivo sea movido al servidor.
            if (move_uploaded_file($file['tmp_name'], $path . $name)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /*
    *   Método para validar la ubicación de un archivo antes de borrarlo del servidor.
    *
    *   Parámetros: $path (ruta del archivo) y $name (nombre del archivo).
    *   
    *   Retorno: booleano (true si el archivo fue borrado del servidor o false en caso contrario).
    */
    public function deleteFile($path, $name)
    {
        // Se verifica que la ruta exista.
        if (file_exists($path)) {
            // Se comprueba que el archivo sea borrado del servidor.
            if (@unlink($path . $name)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    /*
    *   Método para validar un número natural como por ejemplo llave primaria, llave foránea, entre otros.
    *
    *   Parámetros: $value (dato a validar).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateNaturalNumber($value)
    {
        // Se verifica que el valor sea un número entero mayor o igual a uno.
        if (is_numeric($value)) {

            if ((int)$value >= 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un correo electrónico.
    *
    *   Parámetros: $value (dato a validar).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateEmail($value)
    {
        if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un dato booleano.
    *
    *   Parámetros: $value (dato a validar).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateBoolean($value)
    {
        if ($value == 1 || $value == 0 || $value == true || $value == false) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar una cadena de texto (letras, digitos, espacios en blanco y signos de puntuación).
    *
    *   Parámetros: $value (dato a validar), $minimum (longitud mínima) y $maximum (longitud máxima).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateString($value, $minimum, $maximum)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\,\;\.\-]{' . $minimum . ',' . $maximum . '}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un dato alfabético (letras y espacios en blanco).
    *
    *   Parámetros: $value (dato a validar), $minimum (longitud mínima) y $maximum (longitud máxima).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateAlphabetic($value, $minimum, $maximum)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]{' . $minimum . ',' . $maximum . '}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un dato alfanumérico (letras, dígitos y espacios en blanco).
    *
    *   Parámetros: $value (dato a validar), $minimum (longitud mínima) y $maximum (longitud máxima).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateAlphanumeric($value, $minimum, $maximum)
    {
        // Se verifica el contenido y la longitud de acuerdo con la base de datos.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ,\s]{' . $minimum . ',' . $maximum . '}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un dato monetario.
    *
    *   Parámetros: $value (dato a validar).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateMoney($value)
    {
        // Se verifica que el número tenga una parte entera y como máximo dos cifras decimales.
        if (preg_match('/^[0-9]+(?:\.[0-9]{1,2})?$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar una contraseña.
    *
    *   Parámetros: $value (dato a validar).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validatePassword($value)
    {
        // Se verifica la longitud mínima.
        if (strlen($value) >= 6) {
            // Se verifica la longitud máxima.
            if (strlen($value) <= 72) {
                return true;
            } else {
                $this->passwordError = 'Clave mayor a 72 caracteres';
                return false;
            }
        } else {
            $this->passwordError = 'Clave menor a 6 caracteres';
            return false;
        }
    }


    /*
    *   Método para validar el formato del DUI (Documento Único de Identidad).
    *
    *   Parámetros: $value (dato a validar).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateDUI($value)
    {
        // Se verifica que el número tenga el formato 00000000-0.
        if (preg_match('/^[0-9]{8}[-][0-9]{1}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar un número telefónico.
    *
    *   Parámetros: $value (dato a validar).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validatePhone($value)
    {
        // Se verifica que el número tenga el formato 0000-0000 y que inicie con 2, 6 o 7.
        if (preg_match('/^[2,6,7]{1}[0-9]{3}[-][0-9]{4}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Método para validar una fecha.
    *
    *   Parámetros: $value (dato a validar).
    *   
    *   Retorno: booleano (true si el valor es correcto o false en caso contrario).
    */
    public function validateDate($value)
    {
        // Se dividen las partes de la fecha y se guardan en un arreglo en el siguiene orden: año, mes y día.
        $date = explode('-', $value);
        if (checkdate($date[1], $date[2], $date[0])) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Función para verificar que una palabra no exista dentro de la contraseña
     * 
     * Se devolverá true si es encontrada o por lo menos una parte de ella
     * 
     * Se devolverá false si no es contrada, ni tampoco una fracción de ella
     * 
     * Si la palabra a buscar es demasiado pequeña <=3 solo se buscará solo si la palabra completa existe
     * 
     */

    public function encontrarPalabra($palabra, $clave)
    {
        //Se verifica la longitud de la palabra a buscar
        if (strlen($palabra) > 3) {
            //Si la palabra no es muy pequeña se inicia el proceso de coincidencias
            $coincidencias = 0;
            //Se verifica si la palabra a buscar es compuesta (Más de una palabra separada por espacio)
            $palabraDividida = explode(" ", $palabra);
            //Se divide la clave en un arreglo
            $claveDividida = str_split($clave);
            //Se procede a revisar todas las subcadenas obtenidas de la palabra de busqueda
            foreach ($palabraDividida as $palabraActual) {

                //Se divide la palabra actual en un vector
                $palabraBusqueda = str_split(strtolower($palabraActual));
                /**
                 * Se revisa caracter por caracter de la palabra a buscar ya que es mas corta que la clave
                 * si existe alguna coincidencia del caracter que se esté evaluando con el caracter de la clave
                 * Si se encuentra el mismo caracter se suma una coincidencia, y se continua con el siguiente 
                 * de la clave, y si este vuelve a encontrarse se vuelve a sumar otra coincidencia
                 * pero si ya no es la misma esta secuencia se rompe y se reiniciará las coincidencias a 0
                 */
                for ($i = 0; $i < count($claveDividida); $i++) {
                    //Se revisa si el caracter a revisar es una letra
                    if (ctype_alpha($claveDividida[$i])) {
                        //Si es así, se pasa ese carácter a minúscula
                        $claveDividida[$i] = strtolower($claveDividida[$i]);
                    }
                    //Se revisa si el carácter de la clave es el mismo carácter de la palabra
                    if ($claveDividida[$i] == $palabraBusqueda[$coincidencias]) {
                        //Se suman las coincidencias
                        $coincidencias++;
                    } else {
                        //Se revisa si el caracter de la palabra tiene una "i" o una "y" las cuales se tomarán como si
                        //se tratara de un disminutivo de la palabra, (Es un caso excepcional)
                        if (preg_match('/[yYiI]/', $claveDividida[$i])) {
                            if ($claveDividida[$i] == $palabraBusqueda[$coincidencias]) {
                                //Se suman las coincidencias
                                $coincidencias++;
                            } else {
                                $coincidencias = 0; //Se reinician las coincidencias
                            }
                        }
                        $coincidencias = 0; //Se reinician las coincidencias
                    }
                    /**
                     * Se revisa el total de coincidencias
                     * Las cuales deben de ser de al menos 3
                     */
                    if ($coincidencias >= 3) {
                        return true;
                        break;
                    }
                }
            }
            //Si nunca llegó a las 3 o más coincidencias se toma comoque la palabra no se encuentra dentro de la clave
            return false;
        }
    }

    /**
     * Función para validar que la fecha de nacimiento no esté dentro de la contraseña
     */

    public function validarFecha($clave, $fecha)
    {
        //Variable para validar las coincidencias
        $coincidencias = 0;
        //Variable general para revisar la fecha
        $fechaModificada = [];
        //Variable que contendrá la fecha en un solo string
        $fechaTotal = '';
        //Se verifica si la fecha dada contiene guiones como parte del formato
        if (str_contains($fecha, '-')) {
            //Se crea un arreglo separado por los guiones
            $fechaModificada = explode('-', $fecha);
        } else {
            //Se crea un arreglo separado por las plecas
            $fechaModificada = explode('/', $fecha);
        }

        //Se revisa cada caso de la fecha encontrada
        for ($i = 0; $i <= count($fechaModificada); $i++) {
            //Se revisa si ya es el último dato
            if (count($fechaModificada) == $i) {
                //Se revisa la unión de toda la fecha para determinar si está dentro de la fecha
                foreach ($fechaModificada as $trozo) {
                    $fechaTotal = $fechaTotal . $trozo;
                }
                //Se revisa si la fecha completa está dentro de la contraseña
                if (str_contains($clave, $fechaTotal)) {
                    $coincidencias = $coincidencias + 3;
                }
            } else {
                //Se evalua si una fracción de la fecha está dentro de la contraseña
                if (str_contains($clave, $fechaModificada[$i])) {
                    $coincidencias++;
                }
            }

            /**
             * Se revisa la cantidad de coincidencias que se han encontrado
             * Si se han encontrado 2 se da por hecho que al menos una parte 
             * de la fecha está dentro de la fecha
             */

            if ($coincidencias > 1) {
                return true;
                break;
            }
        }
        //Si todo está bien se devuelve false porque no es encontró
        return false;
    }


    /**
     * Función para validar que más de tres carácteres del mismo tipo no sean parte de la contraseña
     * 
     * Es decir, que un máximo de 3 carácteres pueden ser parte de la contraseña, pero si ya existen 4
     * en línea, lo colocará como una contraseña "insegura"
     * 
     * Se tomarán en cuenta estos tres tipos de carácteres
     *  - Números
     *  - Símbolos
     *  - Letras (Sin diferencia entre mayúsculas y minúsculas)
     * 
     * Si hay 3 de un mismo tipo, pero luego hay un carácter que rompe la consecutividad y luego se continua
     * no se tomará en cuenta ese quinto carácter, y se reiniciará el conteo
     * 
     */

    public function validarContinuo($clave)
    {
        //Se crea el contador de continuidad
        $contador = array('numero' => 0, 'letra' => 0, 'simbolo' => 0);
        //Se pasa la clave a un vector para analizarlo uno por uno
        $division = str_split($clave);
        //se procede a revisar la clave carácter por carácter
        foreach ($division as $caracter) {
            //Se revisa si el valor es un número
            if (ctype_digit($caracter)) {
                $contador['numero']++;
            } else {
                $contador['numero'] = 0;
            }

            //Se revisa si el valor es una letra
            if (ctype_alpha($caracter)) {
                $contador['letra']++;
            } else {
                $contador['letra'] = 0;
            }

            //Se revisa si el valor es un símbolo
            if (ctype_punct($caracter)) {
                $contador['simbolo']++;
            } else {
                $contador['simbolo'] = 0;
            }

            //Si se detecta que ha llegado a 4 consecutivas, entonces se detiene e informe que se ha llegado al limite
            if ($contador['simbolo'] > 3 || $contador['numero'] > 3 || $contador['letra'] > 3) {
                return true;
                break;
            }
        }
        //Si en ningún momento se detectó una llegada a 4 valores consecutivos, se retorna un false
        return false;
    }


    /**
     * Función para validar contraseña segura
     * 
     * Se validan los siguientes aspectos
     * 
     * - Mínimo de 8 caracteres
     * - Máximo de 72 caracteres
     * - Que contenga al menos 1 letra mayúscula
     * - Que contenga al menos 1 letra mayúscula
     * - Que contenga al menos 1 símbolo
     * - Que contegan al menos 1 número
     * - Que el usuario no esté dentro de la contraseña
     * - Que el nombre no esté dentro de la contraseña
     * - Que el apellido no esté dentro de la contraseña
     * - Que el correo no esté dentro de la contraseña
     * - Que la fecha de nacimiento no esté dentro de la contraseña
     * - Que no existan más de 3 carácteres del mismo tipo juntos
     */

    public function validateSafePassword($clave, $usuario, $nombre, $apellido, $correo, $fecha)
    {
        //Se procede a revisa que la contraseña sea superior a 8 carácteres
        if (strlen($clave) < 8) {
            $this->passwordError = 'La contraseña debe de contener al menos 8 caracteres';
            return false;
        } elseif (strlen($clave) > 72) {
            $this->passwordError = 'La contraseña debe de tener como máximo 72 carácteres';
            return false;
        } elseif (!preg_match('/[A-Z]/', $clave)) {
            $this->passwordError = 'La contraseña debe de contener al menos una letra mayúscula';
            return false;
        } elseif (!preg_match('/[a-z]/', $clave)) {
            $this->passwordError = 'La contraseña debe de contener al menos una letra minúscula';
            return false;
        } elseif (!preg_match('/[0-9]/', $clave)) {
            $this->passwordError = 'La contraseña debe de contener al menos un número';
        } elseif (!preg_match('/[áÁäÄéÉëËíÍïÏóÓöÖúÚüÜ!#$&()=?¡!¿?*-+.,;:]/', $clave)) {
            $this->passwordError = 'La contraseña debe de contener al menos un símbolo';
            return false;
        } elseif (str_contains($clave, "'") || str_contains($clave, "'") || str_contains($clave, "\\") || str_contains($clave, "`") || str_contains($clave, "<") || str_contains($clave, ">")) {
            $this->passwordError = 'Existen simbolos no permitidos dentro de la contraseña';
            return false;
        } elseif ($this->encontrarPalabra($usuario, $clave)) {
            $this->passwordError = 'Tú usuario o una fracción de él no puede ser parte de la contraseña';
            return false;
        } elseif ($this->encontrarPalabra($nombre, $clave)) {
            $this->passwordError = 'Tú nombre o una fracción de él no puede ser parte de la contraseña';
            return false;
        } elseif ($this->encontrarPalabra($apellido, $clave)) {
            $this->passwordError = 'Tú apellido o una fracción de él no puede ser parte de la contraseña';
            return false;
        } elseif ($this->encontrarPalabra(substr($correo, 0, strripos($correo, '@')), $clave)) {
            $this->passwordError = 'Tú correo o una fracción de él no puede ser parte de la contraseña';
            return false;
        } elseif ($this->encontrarPalabra(substr(substr($correo, strripos($correo, '@') + 1, strripos($correo, '.')), (strlen($correo) - (strlen($correo))), (strripos($correo, '.') - strlen($correo))), $clave)) {
            $this->passwordError = 'El dominio de tu correo no puede ser parte de la contraseña';
            return false;
        } elseif ($this->validarFecha($clave, $fecha)) {
            $this->passwordError = 'La fecha o una parte de ella no puede ser parte de la contraseña';
            return false;
        } elseif (preg_match('/insert/i', $clave) || preg_match('/select/i', $clave) || preg_match('/update/i', $clave) || preg_match('/delete/i', $clave) || preg_match('/drop/i', $clave) || preg_match('/truncate/i', $clave)) {
            $this->passwordError = 'No se admiten consultas SQL dentro de la contraseña';
            return false;
        } elseif (preg_match('/script/i', $clave) || preg_match('/html/i', $clave) || preg_match('/php/i', $clave) || preg_match('/ or /i', $clave) || preg_match('/ and /i', $clave) || preg_match('/ && /i', $clave) || preg_match('/ || /i', $clave)) {
            $this->passwordError = 'No se admiten código dentro de la contraseña';
            return false;
        } elseif ($this->validarContinuo($clave)) {
            $this->passwordError = 'La contraseña no debe de contener más de 3 caracteres del mismo tipo consecutivamente';
            return false;
        } else {
            return true;
        }
    }

    /**
     * Función para validar que los campos dentro a insertar no contenga datos peligroso para el sistema
     * 
     * Se evaluarán los siguientes apartados
     * - Simboles o caracteres invalidos
     * - Palabras peligrosas
     */

    public function validateDanger($campo)
    {
        if (str_contains($campo, "'") || str_contains($campo, "'") || str_contains($campo, "\\") || str_contains($campo, "`") || str_contains($campo, "<") || str_contains($campo, ">")) {
            $this->exception = 'Existen simbolos no permitidos dentro de los campos';
            return false;
        } elseif (preg_match('/insert/i', $campo) || preg_match('/select/i', $campo) || preg_match('/update/i', $campo) || preg_match('/delete/i', $campo) || preg_match('/drop/i', $campo)) {
            $this->exception = 'No se admiten consultas SQL dentro de los campos';
            return false;
        } elseif (preg_match('/script/i', $campo) || preg_match('/html/i', $campo) || preg_match('/php/i', $campo) || preg_match('/or/i', $campo) || preg_match('/and/i', $campo)) {
            $this->exception = 'No se admiten código dentro de los campos';
            return false;
        } else {
            return true;
        }
    }
}
