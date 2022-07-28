<?php

//Modelo para el dashboard empleados
class Dashboard extends Verificador
{
    //variables generales para las operaciones Scrud

    private $identificador = null;
    private $nombre_empleado = null;
    private $apellido_empleado = null;
    private $direccion_empleado = null;

    //Se crean los métodos para interactuar con la base de datos}
    public function InicioSesion()
    {
        $sql = "SELECT CONCAT(TO_CHAR(fecha_actividad, 'TMDay'), ' ',(EXTRACT(DAY FROM (fecha_actividad))), ' de ',TO_CHAR(fecha_actividad, 'TMMonth')) as fecha, (calcular_actividad(id_empleado, DATE(fecha_actividad))) as total FROM actividad_empleado
            WHERE DATE(fecha_actividad) BETWEEN (SELECT DATE(CURRENT_DATE-'20 days'::interval)) AND CURRENT_DATE
            GROUP BY fecha, id_empleado, total";
        $params = null;
        return database::multiFilas($sql, $params);
    }
}
