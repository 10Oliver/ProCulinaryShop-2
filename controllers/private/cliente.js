//Se crea la constante con parte de la dirección de la api
const API_cliente = SERVER + "private/api_cliente.php?action=";

//Se crea un método dondese cargaran datos al cargar la pagina

document.addEventListener("DOMContentLoaded", function () {
    //Se cargan los datos en la tabla, la función está en components.js
    leerTablas(API_cliente, "cargarDatos");
});

//Función que carga los datos en la tabla
function llenarTabla(dataset) {
    //Se crea la variable donde se guardarán los datos
    let contenido = "";
    //Se explora el vector fila por fila
    dataset.map(function (row) {
        //Se ingresa el HTML a inyectar
        if (row.estado_cliente) {
            contenido += `
            <tr>
                <td>${row.id_cliente}</td>
                <td>${row.nombre_cliente} ${row.apellido_cliente}</td>
                <td>${row.correo_cliente}</td>
                <td>${row.telefono_cliente}</td>
                <td>${row.usuario_cliente}</td>
                <td> 
                    <div class="switch">
                        <label>
                        <input id="cliente${row.id_cliente}" type="checkbox" checked="on" onClick="actualizarCliente(${row.id_cliente})">
                        <span class="lever"></span>
                        </label>
                    </div>
                </td>
                <td>
                    <a href="" onClick="reporte(${row.id_cliente})" class="btn">
                    <i class="material-icons">receipt</i>
                    </a>
                </td>
            </tr>`;
        } else {
            contenido += `
            <tr>
                
                <td>${row.id_cliente}</td>
                <td>${row.nombre_cliente} ${row.apellido_cliente}</td>
                <td>${row.correo_cliente}</td>
                <td>${row.telefono_cliente}</td>
                <td>${row.usuario_cliente}</td>
                <td> 
                    <div class="switch">
                        <label>
                        <input id="cliente${row.id_cliente}" type="checkbox" onClick="actualizarCliente(${row.id_cliente})">
                        <span class="lever"></span>
                        </label>
                    </div>
                </td>
                <td>
                    <a href="" onClick="reporte(${row.id_cliente})" class="btn">
                        <i class="material-icons">receipt</i>
                    </a>
                </td>
            </tr>`;
        }
    });
    //Se le insertan las filas a la tabla en la vista
    document.getElementById("tabla_cuerpo").innerHTML = contenido;
}

//Método para buscar entre los clientes
document.getElementById("buscador").addEventListener("keyup", function () {
    //Se obtiene el valor del buscador
    let texto = document.getElementById("buscador").value;
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("buscador", texto);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_cliente, "buscar", datos);
});

//Función que actualiza el estado del comentario

function actualizarCliente(id) {
    //Se crea el dato de tipo formulario a enviar
    let datos = new FormData();
    //Se llena con el name y el valor del identificador
    datos.append("identificador_p", id);
    if (document.getElementById("cliente" + id).checked) {
        //Se toma como encendido el comentario
        datos.append("valor", true);
    } else {
        //Se toma como apagado el comentario
        datos.append("valor", false);
    }
    fetch(API_cliente + "actualizarCliente", {
        method: "post",
        body: datos,
    }).then(function (request) {
        //Se revisa si la petición se ejecutó correctamente
        if (request.ok) {
            //Se convierte la respuesta a un JSON
            request.json().then(function (respose) {
                //Se revisa si se obtuvo una respuesta satisfactoria
                if (!respose.status) {
                    //Si ocurrió algún problema
                    sweetAlert(2, respose.exception, null);
                }
            });
        } else {
            //Se escribe en la consola el error
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Función para obtener el reporte de clientes
function reporte(id) {
    //Se previene el refrescado de la página
    event.preventDefault();
    //Se crea una variable para guardar los datos
    let datos = new FormData();
    datos.append('identificador', id);
    //Se crea la petición
    fetch(API_cliente + 'reporte', {
        method: 'post',
        body: datos,
    }).then(function (request) {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se pasa a formato JSON
            request.json().then(function (response) {
                //Se verifica el estado devuelto por la api
                if (response.status) {
                    //Se crea variables donde se guardarán los datos
                    let cabeceras = [], general = [];
                    //Se extraen los datos fila por fila
                    response.dataset.map(function (row) {
                        //Se crea un vector que guardará los datos por fila
                        let fila = [];
                        //Se guardan los datos por filla
                        fila.push(row.numeroso, row.caro, row.cantidad, '$' + row.promedio, '$' + row.total, row.fecha_hora);
                        //Se agrega al contendor de filas
                        general.push(fila);
                    });
                    //Se colocan las cabeceras del reporte
                    cabeceras.push('Producto más númeroso', 'Producto más caro', 'Total de producto', 'Costo promedio de productos', 'Total de factura', 'Fecha de compra');
                    //Se envian los datos para generar un reporte
                    reporteTablas(cabeceras, general,  "Historial de compras de cliente "+ moment().format("YYYY-MM-DD"), 'Historial de compras');
                } else {
                    //Se muestra el error
                    sweetAlert(2, response.exception, null);
                }
            })

        } else {
            //Se imprime el error en la consola
            console.log(request.status + ' ' + request.statusText);
        }
    })
}