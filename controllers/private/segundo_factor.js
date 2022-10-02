//Se crea la constante con la ruta hacia la api
const API_FACTOR = SERVER + 'private/api_login.php?action=';

//Se crea el método que verificará el estado del segundo paso de autentificación
document.addEventListener('DOMContentLoaded', () => {
    //Se realiza la petición para determinar 
    fetch(API_FACTOR + 'verificarActivacion', {
        method: 'get',
    }).then((request) => {
        //Se verifica el estado de la ejecución
        if (request.ok) {
            //Se pasa a json
            request.json().then((response) => { 
                //Se verifica el estado devuelto por la api
                if (response.status) {
                    sweetAlert(1, response.message, null);
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

//Método que se encarga de validar que el código ingresado sea correcto
document.getElementById("segundo_factor").addEventListener('submit', (event) => { 
    //Se previene el refrescado automático
    event.preventDefault();
    //Se realiza la petición para verificar 
    fetch(API_FACTOR + "verificarSegundoPaso", {
            method: "post",
            body: new FormData(document.getElementById("segundo_factor")),
    }).then((request) => { 
        //Se revisa el estado devuelto por la ejecución
        if (request.ok) {
            //Se termina de pasar a formato JSON
            request.json().then((response) => { 
                //Se verifica el estado devuelto por la API
                if (response.status) {
                    //Se muestra la confirmación
                    sweetAlert(1, response.message, 'dashboard.html');
                } else if (response.status == 2) {
                    //Si no está activado se redirecciona al login
                    sweetAlert(2, response.exception, 'index.html');
                } else {
                    //Se muestra el error
                    sweetAlert(2, response.exception, null);
                }
            })
        } else { 
            console.log(request.status + ' ' + request.statusText);
        }
    })
});