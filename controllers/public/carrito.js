//Se crea la constante de la ruta a la API
const API_carrito = SERVER + "public/api_carrito.php?action=";

//Se crea el método que cargará los datos al carrito cuando se cargue la página
document.addEventListener("DOMContentLoaded", function () {
    //Se obtienen los datos
    fetch(API_carrito + 'cargarDatos', {
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
                    sweetAlert(3, response.exception, 'index.html');
                }
                // Se envían los datos al método para cargar los productos
                llenarTabla(data);
            });
        } else {
            //Se imprime el problema al ejecutar la sentencia
            console.log(request.status + " " + request.statusText);
        }
    });
});

//Función que carga los datos del carrito
function llenarTabla(dataset) {
    //Se crea la variable donde se guardarán los datos
    let contenido = "";
    //Se explora el vector fila por fila
    dataset.map(function (row) {
        //Se ingresa el HTML a inyectar
        contenido += `
            <div class="row card valign-wrapper">
                    <div class="col l3 m3 12">
                    <img src="../../api/images/productos/${row.imagen}" class="imagen_carrito">
                    </div>
                    <div class="col l3 m3 s12">
                        <p>${row.nombre_producto}</p>
                    </div>
                    <div class="col l1 m1 s12 center-align">
                        <p id="precio${row.id_detalle_orden}">$${row.precio}</p>
                    </div>
                    <div class="col l2 m1 s12 valign-wrapper">
                        <div class="col l3">
                            <a id="add${row.id_detalle_orden}" 
                            onclick="aumentarProductos(${row.id_detalle_orden})"
                            onblur="">
                                <i class='bx bx-plus negro' ></i>
                            </a>
                        </div>
                        <div class="col l6 ">
                            <input id="cantidad${row.id_detalle_orden}" 
                            value="${row.cantidad_producto_orden}" class="center-align"
                            onkeyup="cambioManual(${row.id_detalle_orden})"
                            onkeypress="return soloNumeros(event)">
                        </div>
                        <div class="col l3">
                            <a  onclick="disminuirProductos(${row.id_detalle_orden})">
                            <i class='bx bx-minus negro' ></i>
                            </a>
                        </div>
                    </div>
                    <div class="col l2 m2 s12">
                        <p id="subtotal${row.id_detalle_orden}">
                        $${(row.precio * row.cantidad_producto_orden).toFixed(2)}</p>
                    </div>
                    <div class="col l1 m1 s12">
                        <a class="tooltipped" id="tool${row.id_detalle_orden
            }" onclick="eliminarCarrito(${row.id_detalle_orden
            })" data-tooltip="Eliminar del carrito">
                            <i class='bx bxs-trash rojo' ></i>
                        </a>
                    </div>
                </div>`;
    });
    //Se le insertan las filas a la tabla en la vista
    document.getElementById("productos_carrito").innerHTML = contenido;
    //se activan los tooltips
    M.Tooltip.init(document.querySelectorAll(".tooltipped"));
}

//Funcion para disminuir la cantidad de productos en el carrito de uno en uno
function disminuirProductos(id) {
    //Se obtiene el valor actual
    let cantidadActual = document.getElementById("cantidad" + id).value;
    //Se verifica si la cantidad será igual a cero
    if (cantidadActual < 2 || cantidadActual == 0) {
        //se le notifica al usuario
        sweetAlert(3, "La cantidad no puede ser inferior a 0", null);
        //Se inicia el tooltip
        M.Tooltip.getInstance(document.getElementById("tool" + id)).open();
        //se cierra después de unos segundos
        setTimeout(function () {
            M.Tooltip.getInstance(document.getElementById("tool" + id)).close();
        }, 3000);
        return false;
    } else {
        //Se crea la variable de tipo form
        let datos = new FormData();
        //Se llena con el name y el valor
        datos.append("identificador", id);
        //Se ejecuta la disminución
        fetch(API_carrito + "disminuirSecuencia", {
            method: "post",
            body: datos,
        }).then(function (request) {
            //Se verifica si se ejecutó correctamente la sentencia
            if (request.ok) {
                //Se convierte la respuesta en formato JSON
                request.json().then(function (response) {
                    //Se verifica que los datos sean satisfactorios
                    if (!response.status) {
                        sweetAlert(2, "La cantidad no pudo ser reducida", null);
                    } else {
                        //Se define el arreglo
                        let data = [];
                        //Se llena el arreglo con la respuesta
                        data = response;
                        //Se carga el nuevo dato en el input
                        document.getElementById("cantidad" + id).value = data.dataset;
                        //Se carga el dato del subtotal
                        document.getElementById("subtotal" + id).innerHTML =
                            "$" +
                            (
                                parseFloat(
                                    document.getElementById("precio" + id).innerHTML.slice(1)
                                ) * parseFloat(cantidad_actual)
                            ).toFixed(2);
                    }
                });
            } else {
                sweetAlert(2, request.exception, null);
            }
        });
    }
}

//Funcion para aumentar la cantidad de productos en el carrito de uno en uno
function aumentarProductos(id) {
    //Se crea la variable de tipo form
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("identificador", id); //Este dato será el del producto a mostrar
    //Se ejecuta la disminución
    fetch(API_carrito + "aumentarSecuencia", {
        method: "post",
        body: datos,
    }).then(function (request) {
        //Se verifica si se ejecutó correctamente la sentencia
        if (request.ok) {
            //Se convierte la respuesta en formato JSON
            request.json().then(function (response) {
                //Se verifica que los datos sean satisfactorios
                if (!response.status) {
                    sweetAlert(3, response.exception, null);
                } else {
                    //Se define el arreglo
                    let data = [];
                    //Se llena el arreglo con la respuesta
                    data = response;
                    //Se carga el nuevo dato en el input
                    document.getElementById("cantidad" + id).value = data.dataset;
                    //Se carga el dato del subtotal
                    document.getElementById("subtotal" + id).innerHTML =
                        "$" +
                        (
                            parseFloat(document.getElementById("precio" + id).innerHTML.slice(1)) *
                            parseFloat(document.getElementById("cantidad" + id).value)
                        ).toFixed(2);

                }
            });
        } else {
            sweetAlert(2, request.exception, null);
        }
    });
}

//función que verifica la existencia cuando se agrega manualmente
function cambioManual(id, event) {
    //Se obtiene el componente
    let componente = document.getElementById("cantidad" + id);
    //Se crea la variable de tipo form
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("identificador", id);
    //Se verifica si el input se encuentra vacío
    if (componente.value.length == 0) {
        componente.value = "1";
    }
    //Se verifica si ya es un 0
    if (componente.value == 0) {
        sweetAlert(3, "La cantidad no puede ser 0", null);
        componente.value = "1";
        //Se abre el tooltip
        M.Tooltip.getInstance(document.getElementById("tool" + id)).open();
        //se cierra después de unos segundos
        setTimeout(function () {
            M.Tooltip.getInstance(document.getElementById("tool" + id)).close();
        }, 3000);
    }
    //Se eliminan los ceros que pueda contener a la izquierda
    componente.value = Number(componente.value);
    //se carga la cantidad del componente
    datos.append("cantidad", componente.value)
    //Se empieza la verificación de la cantidad máxima
    fetch(API_carrito + "CantidadManual", {
        method: 'post',
        body: datos,
    }).then(function (request) {
        //Se revisa si se ejecutó la sentencia
        if (request.ok) {
            //se convierte la respuesta a JSON
            request.json().then(function (response) {
                //se revisa el estado devuelto por la ejecución en la API
                if (response.status) {
                    //Se procede a cambiar la cantidad en el carrito
                    fetch(API_carrito + "colocarManual", {
                        method: "post",
                        body: datos,
                    }).then(function (request) {
                        //Se revisa si la sentencia pudo ser ejecutada
                        if (request.ok) {
                            //Se convierte el resultado a formato JSON
                            request.json().then(function (response) {
                                //Se verifica que los datos obtenidos sean satisfactorios
                                if (response.status) {
                                    //Se carga el dato del subtotal
                                    document.getElementById("subtotal" + id).innerHTML = '$' + (
                                        document.getElementById("precio" + id).innerHTML.slice(1) *
                                        componente.value).toFixed(2);
                                } else {
                                    //Se muestra un mensaje con el error
                                    sweetAlert(2, response.exception, null);
                                }
                            });
                        } else {
                            //Se muestra el error causado al tratar de ejecutarlo
                            console.log(request.status + " " + request.statusText);
                        }
                    });
                } else {
                    //Se le notifica al usuario el error
                    sweetAlert(3, response.exception, null);
                    //se coloca la cantidad máxima del producto
                    componente.value = response.dataset;
                }
            })
        } else {
            sweetAlert(2, request.exception, null);
        }
    });

}

//función para quitar un producto del carrito de compras
function eliminarCarrito(id) {
    //se crea el dato de tipo formulario
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("identificador", id);
    //Se ejecuta la función para reestablecerlo, está en components.js
    eliminarRegistro(API_carrito, "EliminarProductoCarrito", datos, null, "cargarDatos");
}

//función para eliminar todo el pedido del carrito

function eliminarPedido() {
    //se procede a eliminar
    fetch(API_carrito + 'eliminarPedidoTotal', {
        method: "get",
    }).then(function (request) {
        //Se verifica que la sentencia se haya ejecutado
        if (request.ok) {
            //Se convierte la petición en formato JSON
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }

            });
        } else {
            //Se imprime el problema al ejecutar la sentencia
            console.log(request.status + " " + request.statusText);
        }
    });
}

//función para verificar las existencias antes de proceder a terminar el pedido
function verificarExistencia() {
    //Variable de estado
    let verificador = true;
    //Se realiza el procedimiento para obtener los datos y comparar
    fetch(API_carrito + 'ObtenerCantidades', {
        method: "get",
    }).then(function (request) {
        //Se verifica que la sentencia se haya ejecutado
        if (request.ok) {
            //Se convierte la petición en formato JSON
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Se obtienen los datos
                    data = response.dataset;
                    //Se inicia el bucle para verificiar cada cantidad del carrito
                    data.map(function (row) {
                        if (row.cantidad < row.cantidad_producto_orden) {
                            sweetAlert(2, "La cantidad del producto : " + row.nombre_producto + " Debe ser menor o igual a: " + row.cantidad, null);
                            verificador = false;
                            return false;
                        }
                    });
                    //Se le notifica al cliente que está a punto de finalizar su compra
                    if (verificador) {
                        swal({
                            title: "Advertencia",
                            text: 'Estás a punto de terminar tu compra ¿Estás seguro?',
                            icon: "warning",
                            buttons: ["No", "Sí"],
                            closeOnClickOutside: false,
                            closeOnEsc: false,
                        }).then(function (valor) {
                            if (valor) {
                                fetch(API_carrito + "completarPedido", {
                                    method: "get",
                                }).then(function (request) {
                                    //Se verifica si la sentencia fue ejecutada correctamente
                                    if (request.ok) {
                                        //Se convierte la petición a formato JSON
                                        request.json().then(function (response) {
                                            //Se verifica si la respuesta obtenida es satisfactoria
                                            if (response.status) {
                                                //Se le muestra la confirmación al usuario
                                                swal({
                                                    title: "¡Compra completada!",
                                                    text: response.message,
                                                    icon: "info",
                                                    buttons: "Ok",
                                                    closeOnClickOutside: false,
                                                    closeOnEsc: false,
                                                }).then(function () {
                                                    //Se genera la factura
                                                    factura();
                                                    //Se le pregunta al usuario si desea valorar o no
                                                    swal({
                                                        title: "Etapa de valoración",
                                                        text: '¿Te gustaría valorar algún producto de tu compra?',
                                                        icon: "info",
                                                        buttons: ["No", "Sí"],
                                                        closeOnClickOutside: false,
                                                        closeOnEsc: false,
                                                    }).then(function (valor) {
                                                        //Se revisa la elección del usuario
                                                        if (valor) {
                                                            location.href = 'valoraciones.html';
                                                        } else {
                                                            location.href = 'index.html';
                                                        }
                                                    });
                                                });

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
                } else {
                    //Se le notifica el error o que la cantidad es incorrecta
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            //Se imprime el problema al ejecutar la sentencia
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Función para generar la factura
function factura() { 
    //Se crea la petición
    fetch(API_carrito + "obtenerFactura", {
        method: 'get',
    }).then(function (request) { 
        //Se verifica el estado de la ejecución
        if (request.ok) {
            //Se termina de pasar a JSON
            request.json().then(function (response) {
                //Se verifica el estado devuelto por la API
                if (response.status) {
                    //Se crea los vectores donde se guardarán los datos
                    let cabeceras = [], general = [];
                    //Se crea una variable de conteo
                    let total = 0.0;
                    //Se extraen los datos fila por fila
                    response.dataset.map(function (row) {
                        //Se crea un vector para guardar los datos por fila
                        let fila = [];
                        fila.push(
                            row.nombre_producto,
                            row.cantidad_producto_orden,
                            "$" + row.precio_producto_orden,
                            "$" + row.subtotal
                        );
                        total = total + Number(row.subtotal);
                        //Se agrega al contenedor de filas
                        general.push(fila);
                    });
                    //Se agregan los titulos para las cabeceras
                    cabeceras.push('Nombre del producto', 'Cantidad', 'Precio', 'subtotal');
                    //Se agrega el total
                    general.push(["", "", "Total", "$" + total.toFixed(2)]);
                    //Se envian los datos para generar la factura
                    comprobante(cabeceras, general, "Comprobante de venta " + moment().format("YYYY-MM-DD"), 'Comprobante de venta');
                } else { 
                    //Se muestra el error
                    sweetAlert(2, response.exception, 'index.html');
                }
            })
        } else { 
            //Se imprime el error en la consola
            console.log(request.status + ' ' + request.statusText);
        }
    });
}