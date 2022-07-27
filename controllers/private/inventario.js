// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_inventario = SERVER + "private/api_inventario.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    leertablas(API_inventario, "cargarDatos");
    leertablas(API_inventario, "CargarTablaCategoria");
    leertablas(API_inventario, "cargarDatos");
});
//Función que llenará la tabla
/**
 * function llenar_tabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    //variable para identificar el componente al cual se le asignará
    let componente = "";
    //Se recorre el conjunto para determinar fila por fila la cantidad de registros
    dataset.map(function (row) {
        //se revisa si existe el nombre correcto
        switch (row.length) { 
            case 5:
                contenido += `
                    <tr>
                    <td>${row.id_producto}</td>
                    <td>${row.nombre_producto}</td>
                    <td>${row.cantidad}</td>
                    <td>${row.descripcion}</td>
                    <td>${row.precio}</td>
                    <td>${row.descuento}</td>
                    <td>
                        <img src="../../api/images/productos/${row.imagen}" alt="">
                    </td>
                    <td>
                        <a onclick="modal_actualizar(${row.id_producto})" class="btn editar"><i
                            class="material-icons ">create</i></a>
                        <a onclick="modal_eliminar(${row.id_producto})" class=" btn eliminar"><i
                            class="material-icons ">delete</i></a></td>
                    </tr>
                    `;
                
                componente = 'cuerpo_inventario_producto';
                break;
            case 3:
                contenido += `
                    <tr>
                    <td>${row.id_categoria}</td>
                    <td>${row.nombre_categoria}</td>
                    <td>
                        <img src="../../api/images/productos/${row.imagen}" alt="">
                    </td>
                    <td>
                        <a onclick="modal_actualizar(${row.id_categoria})" class="btn editar"><i
                            class="material-icons ">create</i></a>
                        <a onclick="modal_eliminar(${row.id_categoria})" class=" btn eliminar"><i
                            class="material-icons ">delete</i></a></td>
                    </tr>
                    `;
                componente = 'cuerpo_inventario_categoria';
                break;
            case 1:
                contenido += `
                    <tr>
                    <td>${row.id_material}</td>
                    <td>${row.material}</td>
                    <td>
                        <a onclick="modal_actualizar(${row.id_material})" class="btn editar"><i
                            class="material-icons ">create</i></a>
                        <a onclick="modal_eliminar(${row.id_material})" class=" btn eliminar"><i
                            class="material-icons ">delete</i></a></td>
                    </tr>
                    `;
                componente = 'cuerpo_inventario_material';
                break;
        }
        //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
    });

    //Se le insertan las filas a la tabla en la vista
    document.getElementById(componente).innerHTML = contenido;

}
 */

const mostrarDato = (dato) => {
    return dato != undefined ? `<td>${dato}</td>` : '';
}

function llenar_tabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    //Se recorre el conjunto para determinar fila por fila la cantidad de registros
    dataset.map(function (row) {
        //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
        contenido += `
        <tr>
         <td>${row.id_producto}</td>

        <td>${row.nombre_producto}</td>
        <td>${row.cantidad}</td>
        <td>${row.descripcion}</td>
        <td>${row.precio}</td>
        <td>${row.descuento}</td>
        <td>
            <img src="../../api/images/productos/${row.imagen}" alt="">
        </td>
        <td>
            <a onclick="modal_actualizar(${row.id_producto})" class="btn editar"><i
                class="material-icons ">create</i></a>
            <a onclick="modal_eliminar(${row.id_producto})" class=" btn eliminar"><i
                class="material-icons ">delete</i></a></td>
        </tr>
        `;
    });

    //Se le insertan las filas a la tabla en la vista
    document.getElementById("cuerpo_inventario_producto").innerHTML = contenido;

}

//Función que carga los datos en el modal para crear

function abrir_modal_crear() {
    //Se abre el modal para crear
    M.Modal.getInstance(document.getElementById("agregar")).open();
    //Se cargan los selects con los datos 
    cargar_select(API_inventario + "cargarEstados", 'estado_producto', null, null);
    cargar_select(API_inventario + "cargarMaterial", 'material_producto', null, null);
    cargar_select(API_inventario + "cargarCategoria", 'categoria_producto', null, null);

}


/*
<td>${row.id_material}</td>
                            <td>${row.nombre_categoria}</td>
                            <td>${row.imagen_categoria}</td>
                            <td></td>*/

//Método que guarda los datos de los nuevo productos

document.getElementById('agregar_producto').addEventListener('submit', function (event) {
    //Se evita la recarga de la página
    event.preventDefault();
    //Se ejecutá el método que guardará el producto
    guardar_registro(API_inventario, 'guardarProducto', 'agregar_producto', 'agregar');
    //Se actualizan la tabla después de 1 segundo
    setTimeout(function () {
        leertablas(API_inventario, "cargarDatos");
        console.log('Se ha actualizado');
    }, 1000);
})

//Función para pre-cargar los datos en el modal

//Función que prepará los datos para actualizar
function modal_actualizar(identificador) {
    //Se abre el formulario
    M.Modal.getInstance(document.getElementById("modificar")).open();
    // Se establece el campo de imahen como opcional.
    document.getElementById("imagen_productoM").required = false;
    // Se crea datos de tipo formulario para mandarlos
    const identificador_principal = new FormData();
    //Se llena con el name y el valor
    identificador_principal.append("identificador_p", identificador);
    //Se realiza una la petición para cargar los datos en los campos
    fetch(API_inventario + "obtenerActualizar", {
        method: "post",
        body: identificador_principal,
    }).then(function (request) {
        //Se verifica si la sentencia se ejecutó adecuadamente
        if (request.ok) {
            //Se pasa a formato JSOn
            request.json().then(function (response) {
                //Se  verifica el estado de la respuesta
                if (response.status) {
                    //Se cargan los datos con el registro seleccionado
                    document.getElementById("identificadorM").value = response.dataset.id_producto;
                    document.getElementById("nombre_productoM").value =
                        response.dataset.nombre_producto;
                    document.getElementById("cantidadM").value = response.dataset.cantidad;
                    document.getElementById("precio_productoM").value = response.dataset.precio;
                    document.getElementById("descuentoM").value = response.dataset.descuento;
                    document.getElementById("descripcion_productoM").value =
                        response.dataset.descripcion;
                    // Se actualizan los labels como si estuviera escrito algo manualmente
                    M.updateTextFields();
                    //Se carga el select con la función en components.js
                    cargar_select(
                        API_inventario + "cargarEstados",
                        "estado_productoM",
                        response.dataset.id_estado_producto,
                        null
                    );
                    cargar_select(
                        API_inventario + "cargarMaterial",
                        "material_productoM",
                        response.dataset.id_material,
                        null
                    );
                    cargar_select(
                        API_inventario + "cargarCategoria",
                        "categoria_productoM",
                        response.dataset.id_categoria,
                        null
                    );
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
document.getElementById("modificar_producto").addEventListener("submit", function (event) {
    //Se evita que la página se recargue al agregar
    event.preventDefault();
    //Se evaluan los campos para determinar si está vacíos
    if (
        document.getElementById("categoria_productoM").value == 0 ||
        document.getElementById("material_productoM").value == 0 ||
        document.getElementById("estado_productoM").value == 0 ||
        document.getElementById("descripcion_productoM").value == null ||
        document.getElementById("descuentoM").value == null ||
        document.getElementById("precio_productoM").value == null ||
        document.getElementById("cantidadM").value == null ||
        document.getElementById("nombre_productoM").value == null
    ) {
        sweetAlert(3, "Existen campos sin llenar", null);
    } else {
        // Se Llama la función que actualizará el registro, están en components.js
        actualizar_registro(API_inventario, "modificarProducto", "modificar_producto", "modificar");
        //Se actualizan la tabla después de 1 segundo
        setTimeout(function () {
            leertablas(API_inventario, "cargarDatos");
            console.log('Se ha actualizado');
        }, 1000);


    }

});

//Función que eliminar un registro

function modal_eliminar(identificador) {
    //Se crea una constante de tipo Form para guardar el di
    const identificador_principal = new FormData();
    //Se llena con el name y el valor
    identificador_principal.append("identificador_p", identificador);
    //Se ejecuta la función para eliminar el registro
    eliminar_registro(
        API_inventario,
        "eliminarProducto",
        identificador_principal,
        null,
        "cargarDatos"
    );
}

//Función que buscará los datos
document.getElementById('buscador').addEventListener("keyup", function () {
    //Se obtiene el valor del buscador y del cargo
    let texto = document.getElementById("buscador").value;
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valo
    datos.append("buscador", texto);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_inventario, "buscar", datos);
});