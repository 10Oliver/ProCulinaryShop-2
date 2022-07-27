//Se crea la constante de la ruta de la API
const API_historial = SERVER + "public/api_historial.php?action=";

//Método que cargará los datos de los pedidos
document.addEventListener("DOMContentLoaded", function () {
    //Se obtienen los datos
    fetch(API_historial + "obtenerPedidos", {
        method: "get",
    }).then(function (request) {
        //Se verifica que la sentencia se haya ejecutado
        if (request.ok) {
            //Se convierte la petición en formato JSON
            request.json().then(function (response) {
                //Se crea la variable donde se guardarán los datos
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                } else {
                    sweetAlert(3, response.exception, "index.html");
                }
                // Se envían los datos al método para cargar los productos
                llenar_tabla(data);
            });
        } else {
            //Se imprime el problema al ejecutar la sentencia
            console.log(request.status + " " + request.statusText);
        }
    });
});

//Función que carga los datos del historial
function llenar_tabla(dataset) {
    //Se crea la variable donde se guardarán los datos
    let contenido = "";
    //Se explora el vector fila por fila
    dataset.map(function (row) {
        //se crea la variable de la fecha
        let fecha = new Date(row.fecha_hora);
        //se crean los meses
        const months = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        //Se formatea la fecha
        let fechaFormato =
            fecha.getDate() + " de " + months[fecha.getMonth()] + " del " + fecha.getFullYear();

        //se verifica el estado del pedido
        if (row.estado_orden == 'En proceso') {
            //Se ingresa el HTML a inyectar
            contenido += `
                <div class="card-historial card">
                    <div class="row valign-wrapper">
                        <div class="col l3">
                            <h6>${fechaFormato}</h6>
                        </div>
                        <div class="col l2">
                            <a href="#mostrar" class="modal-trigger" onclick="ver_productos(${row.id_orden_compra})"><i class='bx bxs-basket verde'></i></a>
                        </div>
                        <div class="col l3">
                            <h6>$${row.calcular_subtotal}</h6>
                        </div>
                        <div class="col l4">
                        <a class="btn red darken-3" onclick="cancelar_pedido(${row.id_orden_compra})">Cancelar</a>
                        </div>
                    </div>
                </div>    
        `;
        } else {
            //Se ingresa el HTML a inyectar
            contenido += `
                <div class="card-historial card">
                    <div class="row valign-wrapper">
                        <div class="col l3">
                            <h6>${fechaFormato}</h6>
                        </div>
                        <div class="col l2">
                            <a href="#mostrar" class="modal-trigger"  onclick="ver_productos(${row.id_orden_compra})"><i class='bx bxs-basket verde'></i></a>
                        </div>
                        <div class="col l3">
                            <h6>$${row.calcular_subtotal}</h6>
                        </div>
                        <div class="col l4">
                        <p>${row.estado_orden}</p>
                        </div>
                    </div>
                </div>    
        `;

        }
    });
    //Se le insertan las filas a la tabla en la vista
    document.getElementById("listadoPedidos").innerHTML = contenido;
}

//función para cancelar el pedido

function cancelar_pedido(id) {
    //se crea la variable del tipo form data
    let datos = new FormData();
    //se llena con los datos
    datos.append("identificador", id);
    swal({
        title: "Advertencia",
        text: "Está acción no se puede deshacer",
        icon: "warning",
        buttons: ["No", "Sí"],
        closeOnClickOutside: false,
        closeOnEsc: false,
    }).then(function (valor) {
        if (valor) {
            fetch(API_historial + "cancelarPedido", {
                method: "post",
                body: datos,
            }).then(function (request) {
                //Se verifica si la sentencia fue ejecutada correctamente
                if (request.ok) {
                    //Se convierte la petición a formato JSON
                    request.json().then(function (response) {
                        //Se verifica si la respuesta obtenida es satisfactoria
                        if (response.status) {
                            //Se le muestra la confirmación al usuario
                            sweetAlert(1, response.message, null);
                            //S refresca la tabla de datos
                            leertablas(API_historial, "obtenerPedidos");
                        } else {
                            //Se muestra el error
                            sweetAlert(2, response.exception, null);
                        }
                    });

                } else {
                    console.log(request.status + " " + request.statusText);
                }
            });
        }
    });
}

//Función que carga los datos de un pedido
function ver_productos(identificador) {
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("identificador_p", identificador);
    //Se empieza el proceso para obtener los productos
    fetch(API_historial + "lista", {
        method: "post",
        body: datos,
    }).then(function (request) {
        //Se revisa si la ejecución se realizó correctamente
        if (request.ok) {
            //Se convierte a sentencia a JSON()
            request.json().then(function (response) {
                //Se crea la variable donde se guardarán los datos
                let datos = [];
                //Se verifica el estado de la respuesta
                if (response.status) {
                    datos = response.dataset;
                    //Se crea la variable para guardar el html
                    let contenido = "";
                    datos.map(function (row) {
                        contenido += `
                            <div class="row carta_pedido">
                        <div class="col l5 m12 s12">
                            <img src="../../api/images/productos/${row.imagen}" alt="" class="foto">
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
                                    <p>$${row.precio}</p>
                                </div>
                                <div class="col l12 m12 s12">
                                    <h5>Subtotal</h5>
                                    <p>$${row.subtotal}</p>
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