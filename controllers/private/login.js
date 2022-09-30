// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_login = SERVER + "private/api_login.php?action=";

//Método que verifica la sesión
document.getElementById("login").addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Petición para determinar si el cliente se encuentra registrado.
    fetch(API_login + "iniciarSesion", {
        method: "post",
        body: new FormData(document.getElementById("login")),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status == 2) {
                    sweetAlert(1, response.message, "segundo_factor.html");
                } else if (response.status == 1) {
                    sweetAlert(1, response.message, "dashboard.html");
                } else { 
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
});


