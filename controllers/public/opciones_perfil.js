// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_perfil = SERVER + "public/api_index.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    //Se busca si se ha iniciado sesión o no
    fetch(API_perfil + "obtenerSesion", {
        method: "get",
    }).then(function (request) {
        //Se verifica que la sentencia se haya ejecutado
        if (request.ok) {
            //Se convierte la petición en formato JSON
            request.json().then(function (response) {
                //Se crea la variable donde se guardarán los datos
                let data, opciones, contenido = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status == 1) {
                    data = response.dataset;
                    //Si hay sesión se reeemplazan las opciones
                    contenido = `
                    <a class='dropdown-trigger' data-target='opciones'><i class="material-icons left" >group</i>${data}</a>
                    `;
                    opciones = `
                        <li><a href="historial.html">Historial de pedidos</a></li>
                        <li><a onclick="cerrarSesion()">Cerrar sesión</a></li>
                    `;
                    //se incrustan en el html
                    document.getElementById("sesion").innerHTML = contenido;
                    document.getElementById("opciones").innerHTML = opciones;
                    //se reinicializa el componente
                    M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"));
                } else {
                    console.log("No hay sessión");
                    //si no hay sesión se coloca la opción para iniciar sesión
                    contenido = `
                    <a href="login.html"><i class="material-icons left">group</i>Iniciar sesión</a>
                    `;
                    document.getElementById("sesion").innerHTML = contenido;
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
            });
        } else {
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

