<?php
//Se importan las clases necesarias para el funcionamiento
require_once '../helpers/database.php';
require_once '../helpers/verificador.php';
require_once '../models/empleado.php';

//Se inicia la sesión
session_start();

//Se crean los objetos de las clases correspondiente
$empleado = new empleado