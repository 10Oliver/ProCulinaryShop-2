// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_perfil = SERVER + "private/api_login.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    //Se busca si se ha iniciado sesión o no
    fetch(API_perfil + "datosSesion", {
        method: "get",
    }).then(function (request) {
        //Se verifica que la sentencia se haya ejecutado
        if (request.ok) {
            //Se convierte la petición en formato JSON
            request.json().then(function (response) {
                //Se crea la variable donde se guardarán los datos
                let data = [];
                //se crea la variable donde se guardará el HTML a inyectar
                let contenido = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status == 1) {
                    data = response.dataset;
                    //Si hay sesión se reeemplazan las opciones
                    contenido = `
                        <div class="name_job">
                            <div class="name">${data.nombre}</div>
                            <div class="job">${data.nombre_cargo}</div>
                        </div>
                    `;
                    //se incrustan en el html
                    document.getElementById("datosPerfil").innerHTML = contenido;
                } else {
                    //Se le notifica al usuario
                    sweetAlert(2, response.exception,null);
                }
            });
        } else {
             sweetAlert(2, "No se logró iniciar sesión", "index.html");
            //Se imprime el problema al ejecutar la sentencia
            console.log(request.status + " " + request.statusText);
           
        }
    });
});

//función que cierra la sesión de la cuenta

function cerrarSesion() {
    swal({
        title: 'Advertencia',
        text: '¿Estás seguro de cerrar tu sesión?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
        if (value) {
            fetch(API_perfil + 'CerrarSesion', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            //Se da el mensaje y se redirecciona al index
                            sweetAlert(1, response.message, 'index.html');
                        } else {
                            //se menciona el error
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    //Se envia el error a la consola
                    console.log(request.status + ' ' + request.statusText);
                }
            });
        } else {
            sweetAlert(4, 'Puede continuar con la sesión', null);
        }
    });

}

