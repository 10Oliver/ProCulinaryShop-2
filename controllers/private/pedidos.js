// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_pedidos = SERVER + "private/api_pedidos.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    leerTablas(API_pedidos, "cargarDatos", 1);
});

//Función que llenará la tabla
function llenarTabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    if (dataset.length == 0) {
        //Se le insertan las filas a la tabla en la vista (Se encuentra vacío)
        document.getElementById("cuerpo_pedido").innerHTML = contenido;
    } else {
        //Se recorre el conjunto para determinar fila por fila la cantidad de registros
        dataset.map(function(row) {
            if (row.id_estado_orden == 3) {
                //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
                // Siempre y cuando no este eliminado
                contenido += `
        <tr>
        <td>${row.nombre_cliente}</td>
        <td>${row.direccion}</td>
        <td>${row.fecha_hora}</td>
        <td>${row.calcular_subtotal}</td>
        <td><a href="#mostrar" class="modal-trigger desplegar_lista" onclick="cargarLista(${row.id_orden_compra})"><i class="material-icons">remove_red_eye</i></a></td>
        <td>
            <select disabled id="estado_pedido${row.id_orden_compra}" onchange="actualizarPedido(${row.id_orden_compra})">
            </select>
        </td>
        <td>
            <p>
                <label>
                    <input id="eliminar_pedido${row.id_orden_compra}" type="checkbox" class="filled-in" onchange="eliminarPedido(${row.id_orden_compra})" />
                    <span>${row.estado_orden}</span>
                </label>
            </p>
        </td>
        </tr>
        `;
            } else {
                //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
                //Si está eliminado
                contenido += `
        <tr>
        <td>${row.nombre_cliente}</td>
        <td>${row.direccion}</td>
        <td>${row.fecha_hora}</td>
        <td>${row.calcular_subtotal}</td>
        <td><a href="#mostrar" class="modal-trigger desplegar_lista" onclick="cargarLista(${row.id_orden_compra})"><i class="material-icons">remove_red_eye</i></a></td>
        <td>
            <select id="estado_pedido${row.id_orden_compra}" onchange="actualizarPedido(${row.id_orden_compra}) ">
            </select>
        </td>
        <td>
            <p>
                <label>
                    <input id="eliminar_pedido${row.id_orden_compra}" type="checkbox" class="filled-in" checked="checked" onchange="eliminarPedido(${row.id_orden_compra})" />
                    <span>${row.estado_orden}</span>
                </label>
            </p>
        </td>
        </tr>
        `;
            }
            //Se le insertan las filas a la tabla en la vista
            document.getElementById("cuerpo_pedido").innerHTML = contenido;
            //Se cargan los SELECT con su datos pertinentes
            cargarSelect(
                API_pedidos + "cargarEstados",
                "estado_pedido" + row.id_orden_compra,
                row.id_estado_orden,
                null
            );
        });
    }
}

// Función que actualiza el estado de un pedido

function actualizarPedido(identificador) {
    //Se crea el dato de tipo formulario a enviar
    let datos = new FormData();
    //Se llena con el name y el valor del identificador
    datos.append("identificador_p", identificador);
    //Se llena con el name y el valor del estado
    datos.append("estado", document.getElementById("estado_pedido" + identificador).value);
    //Se empieza a actualizar del pedido
    fetch(API_pedidos + "actualizarEstado", {
        method: "post",
        body: datos,
    }).then(function(request) {
        //Se revisa si la petición se ejecutó correctamente
        if (request.ok) {
            //Se convierte la respuesta a un JSON
            request.json().then(function(respose) {
                //Se revisa si se obtuvo una respuesta satisfactoria
                if (!respose.status) {
                    //Si ocurrió algún problema
                    sweetAlert(2, respose.exception, null);
                } else {
                    //Se actualiza la tabla de datos
                    leerTablas(API_pedidos, "cargarDatos");
                }
            });
        } else {
            //Se escribe en la consola el error
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Función que elimina un pedido

function eliminarPedido(identificador) {
    //Se crea el dato de tipo formulario a enviar
    let datos = new FormData();
    //Se crea la variable para la acción a realizar
    let accion = null;
    //Se llena con el name y el valor del identificador
    datos.append("identificador_p", identificador);
    //Se evalua si se quiere restaurar o eliminar
    if (!document.getElementById("eliminar_pedido" + identificador).checked) {
        accion = "eliminarPedido";
        document.getElementById("eliminar_pedido" + identificador).checked = 0;
    } else {
        accion = "actualizarEstado";
        //Se llena con el name y el valor del identificador
        datos.append("estado", 1);
        document.getElementById("eliminar_pedido" + identificador).checked = 1;
    }
    //Se empieza a actualizar del pedido
    fetch(API_pedidos + accion, {
        method: "post",
        body: datos,
    }).then(function(request) {
        //Se revisa si la petición se ejecutó correctamente
        if (request.ok) {
            //Se convierte la respuesta a un JSON
            request.json().then(function(respose) {
                //Se revisa si se obtuvo una respuesta satisfactoria
                if (!respose.status) {
                    //Si ocurrió algún problema
                    sweetAlert(2, respose.exception, null);
                } else {
                    //Se actualiza la tabla de datos
                    leerTablas(API_pedidos, "cargarDatos");
                }
            });
        } else {
            //Se escribe en la consola el error
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Función que buscará los datos
document.getElementById("buscador").addEventListener("keyup", function() {
    //Se obtiene el valor del buscador
    let texto = document.getElementById("buscador").value;
    //Se obtiene el valor de la categoria a buscar
    let categoria = document.getElementById("categoria_pedido").value;
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("buscador", texto);
    //Se llena con el name y el valor
    datos.append("categoria", categoria);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_pedidos, "buscar", datos);
});

//Función que buscará los datos
document.getElementById("categoria_pedido").addEventListener("change", function() {
    //Se obtiene el valor del buscador
    let texto = document.getElementById("buscador").value;
    //Se obtiene el valor de la categoria a buscar
    let categoria = document.getElementById("categoria_pedido").value;
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("buscador", texto);
    //Se llena con el name y el valor
    datos.append("categoria", categoria);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_pedidos, "buscar", datos);
});

//Función que carga los datos de un pedido
function cargarLista(identificador) {
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("identificador_p", identificador);
    //Se empieza el proceso para obtener los productos
    fetch(API_pedidos + "lista", {
        method: "post",
        body: datos,
    }).then(function(request) {
        //Se revisa si la ejecución se realizó correctamente
        if (request.ok) {
            //Se convierte a sentencia a JSON()
            request.json().then(function(response) {
                //Se crea la variable donde se guardarán los datos
                let datos = [];
                //Se verifica el estado de la respuesta
                if (response.status) {
                    datos = response.dataset;
                    //Se crea la variable para guardar el html
                    let contenido = "";
                    datos.map(function(row) {
                        contenido += `
                            <div class="row carta_pedido">
                        <div class="col l5 m12 s12">
                            <img src="../../api/images/productos/${row.imagen}" alt="">
                        </div>
                        <div class="col l7 m12 s12 ">
                            <div class="col l6 m6 s12">
                                <div class="col l12 m12 s12">
                                    <h5>Titulo</h5>
                                    <p>${row.nombre_producto}</p>
                                </div>
                                <div class="col l12 m12 s12">
                                    <h5>Cantidad</h5>
                                    <p>${row.cantidad_producto_orden}</p>
                                </div>
                            </div>
                            <div class="col l6 m6 s12">
                                <div class="col l12 m12 s12">
                                    <h5>Precio</h5>
                                    <p>${row.precio}</p>
                                </div>
                                <div class="col l12 m12 s12">
                                    <h5>Subtotal</h5>
                                    <p>${row.subtotal}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                            `;
                    });
                    document.getElementById("contenedor_listado").innerHTML = contenido;
                } else {
                    //Se notifica del error
                    sweetAlert(2, request.exception, null);
                }
            });
        }
    });
}