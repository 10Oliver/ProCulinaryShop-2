//Se crea la ruta de la api
const API_registro = SERVER + 'private/api_registro.php?action=';

//Se crea el método que que verificará los datos cuando se cargue la página
document.addEventListener('DOMContentLoaded', function () {
    //Se realiza la petición para saber si todo está funcionando correctamente
});

//Se crea el método para realizar la creación del usuario
document.getElementById("registro").addEventListener('submit', function (event) { 
    //Se previene la recarga de la página
    event.preventDefault();
    //Se realiza la petición
    fetch(API_registro + "registrar", {
        method: "post",
        body: new FormData(document.getElementById("registro")),
    }).then(function (request) { 
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se pasa a JSON
            request.json().then(function (response) { 
                //Se verifica el estado devuelto por la API
                if (response.status) {
                    //muestra la confirmación
                    sweetAlert(1, response.message, 'index.html');
                } else { 
                    //Se muestra el problema
                    sweetAlert(2, response.exception, null);
                }
            })
        } else { 
            //Se muestra el error en la consola
            console.log(request.status + ' ' + request.statusText);
        }
    });
});