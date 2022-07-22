// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_empleado = SERVER + "private/api_dashboard.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    //Se realiza cargan la nueva gráfica
    fetch(API_empleado +'obtenerConexiones', {
        method:'get',
    }).then(function (request) {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se pasa a JSON
            request.json().then(function (response) {
                //Se revisa el estado que se devolvió la respuesta
                if (response.status) {
                    //Se cargan los datos en los nuevo arreglos
                    let cabeceras = [], datos = [];
                    //Se llena los datos para la gráfica
                    response.dataset.map(function (row) {
                        cabeceras.push(row.fecha);
                        datos.push(row.total);
                    })
                    //Se envían los datos para ser gráficados
                    //console.log(cabeceras);
                    console.log(datos);
                    lineaI('.conexiones', cabeceras, datos);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            })
        } else { 
            console.log(request.status, + ' ' + request.statusText);
        }
    })
   
});