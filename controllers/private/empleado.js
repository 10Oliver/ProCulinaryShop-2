


// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_empleado = SERVER + "private/api_empleado.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    leertablas(API_empleado, "cargarDatos");
    cargar_select(API_empleado + "cargarCargos", "selector_cargo", null, 1);
});

//Función que llenará la tabla
function llenar_tabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    //Se recorre el conjunto para determinar fila por fila la cantidad de registros
    dataset.map(function(row) {
        //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
        contenido += `
        <tr>
        <td>${row.id_empleado}</td>
        <td>${row.nombre_empleado} ${row.apellido_empleado}</td>
        <td>${row.telefono_empleado}</td>
        <td>${row.correo_empleado}</td>
        <td>${row.nombre_cargo}</td>
        <td>
            <a onclick="modal_actualizar(${row.id_empleado})" class="btn editar"><i
                class="material-icons ">create</i></a>
            <a href="#eliminar" onclick="modal_eliminar(${row.id_empleado})" class=" btn eliminar"><i
                class="material-icons ">delete</i></a></td>
        </tr>
        `;
    });

    //Se le insertan las filas a la tabla en la vista
    document.getElementById("cuerpo_empleado").innerHTML = contenido;
}

// Método que se encarga de gestionar la creación de nuevos usuarios

document.getElementById("guardar_empleado").addEventListener("submit", function(event) {
    //Se evita que la página se recargue al agregar
    event.preventDefault();
    // Se llama la función que guardará el registro en components.js
    if (
        document.getElementById("cargo_empleado").value == 0 ||
        document.getElementById("estado_empleado").value == 0 ||
        document.getElementById("nombre_empleado").value == null ||
        document.getElementById("dui_empleado").value == null ||
        document.getElementById("correo_empleado").value == null ||
        document.getElementById("telefono_empleado").value == null ||
        document.getElementById("apellido_empleado").value == null ||
        document.getElementById("direccion_empleado").value == null
    ) {
        sweetAlert(3, "Existen campos sin llenar", null);
    } else { 
            guardar_registro(API_empleado, "crearEmpleado", "guardar_empleado", "agregar");
            //Se refresca la tabla de datos
            leertablas(API_empleado, "cargarDatos");
    }
    
});

//Función que carga los datos en los select al momento de activar el modal
function cargar_modal() {
    //Se llena el select de estado con los datos obtenidos
    cargar_select(API_empleado + "cargarEstados", "estado_empleado", null, null);
    // Se llena el select de cargos con los datos obtenidos
    cargar_select(API_empleado + "cargarCargos", "cargo_empleado", null, null);
}

//Función que prepará los datos para actualizar
function modal_actualizar(identificador) {
    //Se abre el formulario
    M.Modal.getInstance(document.getElementById("modificar")).open();
    // Se crea datos de tipo formulario para mandarlos
    const identificador_principal = new FormData();
    //Se llena con el name y el valor
    identificador_principal.append("identificador_p", identificador);
    //Se realiza una la petición para cargar los datos en los campos
    fetch(API_empleado + "obtenerActualizar", {
        method: "post",
        body: identificador_principal,
    }).then(function(request) {
        //Se verifica si la sentencia se ejecutó adecuadamente
        if (request.ok) {
            //Se pasa a formato JSOn
            request.json().then(function(response) {
                //Se  verifica el estado de la respuesta
                if (response.status) {
                    //Se cargan los datos con el registro seleccionado
                    document.getElementById("identificadorM").value =
                        response.dataset.id_empleado;
                    document.getElementById("dui_empleadoM").value = response.dataset.dui;
                    document.getElementById("nombre_empleadoM").value =
                        response.dataset.nombre_empleado;
                    document.getElementById("correo_empleadoM").value =
                        response.dataset.correo_empleado;
                    document.getElementById("telefono_empleadoM").value =
                        response.dataset.telefono_empleado;
                    document.getElementById("nombre_empleadoM").value =
                        response.dataset.nombre_empleado;
                    document.getElementById("apellido_empleadoM").value =
                        response.dataset.apellido_empleado;
                    document.getElementById("direccion_empleadoM").value =
                        response.dataset.direccion_empleado;
                    // Se actualizan los labels como si estuviera escrito algo manualmente
                    M.updateTextFields();

                    //Se carga el select con la función en components.js
                    cargar_select(
                        API_empleado + "cargarCargos", "cargo_empleadoM",
                        response.dataset.id_cargo_empleado, null);
                    cargar_select(
                        API_empleado + "cargarEstados", "estado_empleadoM",
                        response.dataset.id_estado_empleado, null);
                } else {
                    //Se envía la alerta con la excepción
                    console.log("Error en el estado");
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            //Se escribe en la consola el error
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Método que actualiza los datos
document.getElementById("actualizar_empleado_f").addEventListener("submit", function(event) {
    //Se evita que la página se recargue al agregar
    event.preventDefault();
    //Se evaluan los campos para determinar si está vacíos
    if (
        document.getElementById("cargo_empleadoM").value == 0 ||
        document.getElementById("estado_empleadoM").value == 0 ||
        document.getElementById("nombre_empleadoM").value == null ||
        document.getElementById("dui_empleadoM").value == null ||
        document.getElementById("correo_empleadoM").value == null ||
        document.getElementById("telefono_empleadoM").value == null ||
        document.getElementById("apellido_empleadoM").value == null ||
        document.getElementById("direccion_empleadoM").value == null
    ) {
        sweetAlert(3, "Existen campos sin llenar", null);
    } else {
    }
    // Se Llama la función que actualizará el registro, están en components.js
    actualizar_registro(API_empleado, "actualizarEmpleado", "actualizar_empleado_f", "modificar");
    //Se actualizan la tabla
    leertablas(API_empleado, "cargarDatos");
});

//Función que eliminará un registro

function modal_eliminar(identificador) {
    //Se crea una constante de tipo Form para guardar el di
    const identificador_principal = new FormData();
    //Se llena con el name y el valor
    identificador_principal.append("identificador_p", identificador);
    //Se ejecuta la función para eliminar el registro
    eliminar_registro(API_empleado, "eliminarEmpleado", identificador_principal, null, "cargarDatos");
}

//Función que buscará los datos
document.getElementById('buscador').addEventListener("keyup", function() {
    //Se obtiene el valor del buscador y del cargo
    let texto = document.getElementById("buscador").value;
    let categoria = document.getElementById("selector_cargo").value;
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valor con ambos datos
    datos.append("buscador", texto);
    datos.append("categoria", categoria);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_empleado, "buscar", datos);
});


//Función que buscará los datos
document.getElementById('selector_cargo').addEventListener("change", function(event) {
    //Se obtiene el valor del buscador y del cargo
    let texto = document.getElementById("buscador").value;
    let categoria = document.getElementById("selector_cargo").value;
    //Se crea un objeto de tipo form para guardar los datos
    var datos = new FormData();
    //Se llena con el name y el valor con ambos datos
    datos.append("buscador", texto);
    datos.append("categoria", categoria);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_empleado, "buscar", datos);
});

