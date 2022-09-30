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