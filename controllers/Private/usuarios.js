/*Archivo de JavaScript para usuarios*/

//Se crea la constante que guardará la ruta de la API
const API_usuario = SERVER + "private/api_usuario.php?action=";

//Se crea el evento para realizar acciones al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    //Se llenan las tablas
    leertablas(API_usuario, "leerTablas");
    //Se cargan los cargos en el select para el buscador
    cargar_select(API_usuario + "cargarCargos", "cargos_empleado", null, 1);
});

//Función que llenará la tabla
function llenar_tabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    //Se recorre el conjunto para determinar fila por fila la cantidad de registros
    dataset.map(function (row) {
        if (row.hora_unlock_empleado == null) {
            //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
            contenido += `
                <tr>
                <td>${row.id_empleado}</td>
                <td>${row.nombre_empleado} </td>
                <td>${row.usuario_empleado} </td>
                <td>${row.correo_empleado}</td>
                <td>Sin hora de desbloqueo</td>
                <td>Sin intentos gastados: 5/5</td>
                <td>
                    <a onclick="modal_actualizar(${row.id_empleado})" class="btn editar"><i
                        class="material-icons ">create</i></a>
                    <a href="#eliminar" onclick="modal_eliminar(${row.id_empleado})" class=" btn eliminar"><i
                        class="material-icons ">delete</i></a></td>
                </tr>
                `;
        } else {
            //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
            contenido += `
                <tr>
                <td>${row.id_empleado}</td>
                <td>${row.nombre_empleado} </td>
                <td>${row.usuario_empleado} </td>
                <td>${row.correo_empleado}</td>
                <td>${row.hora_unlock_empleado}</td>
                <td>${row.intento_empleado}/5</td>
                <td>
                    <a onclick="modal_actualizar(${row.id_empleado})" class="waves-effect waves-light btn editar red darken-2"><i
                        class="material-icons ">create</i></a>
                    <a href="#eliminar" onclick="modal_eliminar(${row.id_empleado})" class="waves-effect waves-light btn eliminar deep-orange lighten-1"><i
                        class="material-icons ">delete</i></a></td>
                </tr>
                `;
        }
    });

    //Se le insertan las filas a la tabla en la vista
    document.getElementById("tabla_cuerpo").innerHTML = contenido;
}

//Función que cargará los datos en el modal para crear

function cargar_modal() {
    //Se carga el select con los empleados
    cargar_select(API_usuario + "cargarEmpleados", "select_empleados", null, null);
}

//Método que guardará los nuevos usuarios

document.getElementById("agregar_usuario_f").addEventListener("submit", function (event) {
    //Se detiene la recarga de la pagina por la acción de envío del formulario
    event.preventDefault();
    //Se verifican si los campos están vacíos
    if (
        document.getElementById("select_empleados").value == 0 ||
        document.getElementById("nombre_usuario").value == 0 ||
        document.getElementById("contrasena_usuario").value == null ||
        document.getElementById("confir_contrasena_usuario").value == null
    ) {
        sweetAlert(3, "Existen campos sin llenar", null);
    } else if (
        document.getElementById("contrasena_usuario").value !=
        document.getElementById("confir_contrasena_usuario").value
    ) {
        sweetAlert(3, "Las contraseñas no coinciden", null);
    } else if (document.getElementById("contrasena_usuario").value.length < 8) {
        sweetAlert(3, "La contraseña debe ser de minimo 8 caracteres", null);
    } else if (
        document.getElementById("contrasena_usuario").value == "12345678" ||
        document.getElementById("contrasena_usuario").value == "abcdefgh" ||
        document.getElementById("contrasena_usuario").value == "ABCDEFGH"
    ) {
        sweetAlert(3, "La contraseña no puede ser una secuencia de número o letras", null);
    } else {
        //Se envian los datos para que se guarden, esto mediante la función en components.js
        guardar_registro(API_usuario, "crearUsuario", "agregar_usuario_f", "agregar");
        //Se actualiza la tabla de datos
        leertablas(API_usuario, "leerTablas");
    }
});

//Función que cargará los datos en el modal
function modal_actualizar(identificador) {
    //Se crea una constante de tipo Form para guardar el di
    const identificador_principal = new FormData();
    //Se llena con el name y el valor
    identificador_principal.append("identificador_p", identificador);
    //Se ejecuta la función para reestablecerlo, está en components.js
    eliminar_registro(
        API_usuario,
        "actualizarUsuario",
        identificador_principal,
        "¿Estás seguro de reestablecer el usuario?",
        "leerTablas"
    );
}

//Función que cargará los datos en el modal
function modal_eliminar(identificador) {
    //Se crea una constante de tipo Form para guardar el di
    const identificador_principal = new FormData();
    //Se llena con el name y el valor
    identificador_principal.append("identificador_p", identificador);
    //Se ejecuta la función para reestablecerlo, está en components.js
    eliminar_registro(API_usuario, "eliminarUsuario", identificador_principal, null, "leerTablas");
}

//Función que buscará los datos
document.getElementById("buscador").addEventListener("keyup", function () {
    //Se obtiene el valor del buscador y del cargo
    let texto = document.getElementById("buscador").value;
    let categoria = document.getElementById("cargos_empleado").value;
    //Se crea un objeto de tipo form para guardar los datos
    var datos = new FormData();
    //Se llena con el name y el valor con ambos datos
    datos.append("buscador", texto);
    datos.append("categoria", categoria);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_usuario, "buscar", datos);
});

//Función que buscará los datos
document.getElementById("cargos_empleado").addEventListener("change", function () {
    //Se obtiene el valor del buscador y del cargo
    let texto = document.getElementById("buscador").value;
    let categoria = document.getElementById("cargos_empleado").value;
    //Se crea un objeto de tipo form para guardar los datos
    var datos = new FormData();
    //Se llena con el name y el valor con ambos datos
    datos.append("buscador", texto);
    datos.append("categoria", categoria);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_usuario, "buscar", datos);
});

