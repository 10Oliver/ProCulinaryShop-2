// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_login = SERVER + "public/api_login.php?action=";

//método para crear un nuevo cliente
document.getElementById("registro").addEventListener("submit", function (event) {
    //se evita que se recargue la página
    event.preventDefault();
    //se verifica que ambas contraseñas sean iguales
    if (document.getElementById("pass").value != document.getElementById("passR").value) {
        sweetAlert(3, "Las contraseñas no son iguales", null);
    } else if (document.getElementById("pass").value.length < 8) {
        sweetAlert(3, "La contraseña debe tener al menos 8 caracteres", null);
    } else if (
        document.getElementById("pass").value == "12345678" ||
        document.getElementById("pass").value == "abcdefgh"
    ) {
        sweetAlert(3, "La contraseña no puede ser una secuencia de caracteres", null);
    } else {
        //se empieza con el guardado de los datos
        fetch(API_login + "guardarCliente", {
            method: "post",
            body: new FormData(document.getElementById("registro")),
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON, servirá para el mensaje
                request.json().then(function (response) {
                    //Se confirma si la sentencia fue ejecutada correctamente
                    if (response.status) {
                        // Se muestra la confirmación
                        sweetAlert(1, response.message, 'login.html');
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.status + " " + request.statusText);
            }
        });
    }
});
