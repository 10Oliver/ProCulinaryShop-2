// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_detalle = SERVER + "public/api_detalle.php?action=";

//Método que se ejecuta cuando se carga la página

document.addEventListener("DOMContentLoaded", function () {
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const ID = params.get("id");
    //Se crea una variable de tipo formulario
    let dato = new FormData();
    //se llena con el identificador
    dato.append("identificador", ID);
    //se busca el producto
    fetch(API_detalle + "cargarProducto", {
        method: "post",
        body: dato,
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
                    sweetAlert(2, response.exception, null);
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
                llenar_tabla(data);
            });
        } else {
            //Se imprime el problema al ejecutar la sentencia
            console.log(request.status + " " + request.statusText);
        }
    });
});

//Función que llenará la tabla
function llenar_tabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
    contenido += `
            <div class="col l7 m5 s12">
                <img src="../../api/images/productos/${dataset.imagen}" alt="" class="foto">
            </div>
            <div class="col l5 m7 s12 " id="datos_productolg">
                <!--Datos principales-->
                <h2>${dataset.nombre_producto}</h2>
                <h6>${dataset.descripcion}</h6>
                <div class="col l12 m12 s12 ordenar_detalles">
                    <div class="ordenardetallesproducto">
                        <h6 class="titulos_datos" id="cantidadR">Restantes: ${dataset.cantidad}</h6>
                    </div>
                    <div class="ordenardetallesproducto">
                        <h6 class="titulos_datos">Material: ${dataset.material} </h6>
                    </div>
                    <div class="ordenardetallesproducto">
                        <h6 class="titulos_datos">Categoría: ${dataset.nombre_categoria}</h6>
                    </div>
                </div>
                <!--Precio y opciones para el comprar-->
                <div class="col l12 m12 s12 center-align">
                    <h5 id="precio" class="precio_detalle">$${dataset.precio}</h5>
                    <div class="col l12 m12 s12 valign-wrapper">
                        <div class="col l3">
                            <a id="add" onclick="aumentar_productos()" onblur="">
                                <i class="bx bx-plus negro"></i>
                            </a>
                        </div>
                        <div class="col l6 ">
                            <input id="cantidad" value="1" class="center-align" onkeyup="cambioManual()"
                                onkeypress="return soloNumeros(event)">
                        </div>
                        <div class="col l3">
                            <a onclick="disminuir_productos()">
                                <i class="bx bx-minus negro"></i>
                            </a>
                        </div>
                    </div>
                    <a class="waves-effect waves-light btn green" onclick="enviar(${dataset.id_producto})">Añadir al carrito<i class="fa-solid fa-cart-plus left"></i></a>

                </div>
            </div>

        `;

    //Se le insertan las filas a la tabla en la vista
    document.getElementById("producto").innerHTML = contenido;
    //variable secuandaria para guardar el id del producto
    let contenidoComentario = [];
    //se llena con el id
    contenidoComentario = `
        <a href="#comentarios" onclick="cargarComentarios(${dataset.id_producto})" class="waves-effect waves-light btn modal-trigger valign-wrapper">
            <i class="material-icons">message</i>Comentarios
        </a>
    `;
    //se inserta el nuevo botón
    document.getElementById("comentario").innerHTML = contenidoComentario;
}

//Funcion para disminuir la cantidad de productos en el carrito de uno en uno
function disminuir_productos() {
    //Se obtiene el valor actual
    let cantidad_actual = document.getElementById("cantidad");
    //Se verifica si la cantidad será igual a cero
    if (cantidad_actual.value < 1) {
        //se le notifica al usuario
        sweetAlert(3, "La cantidad no puede ser inferior a 1", null);
        //Se establece como 1
        cantidad_actual.value = 1;
    } else {
        cantidad_actual.value = cantidad_actual.value - 1;
    }
    //se limpia de ceros inncesarios
    cantidad_actual.value = Number(cantidad_actual.value);
}

//Funcion para aumentar la cantidad de productos en el carrito de uno en uno
function aumentar_productos() {
    //Se obtiene el valor actual
    let cantidad_actual = document.getElementById("cantidad");
    //se verifica si la cantidad es superior a la cantidad mostrada
    if (
        Number(cantidad_actual.value) + 1 >
        document.getElementById("cantidadR").innerHTML.slice(11)
    ) {
        //se le notifica al usuario
        sweetAlert(3, "Has superado la cantidad máxima", null);
        //se coloca la cantidad máxima
        cantidad_actual.value = document.getElementById("cantidadR").innerHTML.slice(11);
    } else {
        cantidad_actual.value = Number(cantidad_actual.value) + 1;
    }
    //se limpia de ceros inncesarios
    cantidad_actual.value = Number(cantidad_actual.value);
}

//función que verifica la existencia cuando se agrega manualmente
function cambioManual() {
    //se obtiene el componente
    let cantidad_actual = document.getElementById("cantidad");
    //Se verifica si se superaría la cantidad máxima
    if (Number(cantidad_actual.value) > document.getElementById("cantidadR").innerHTML.slice(11)) {
        //se le notifica al usuario
        sweetAlert(3, "Has superado la cantidad máxima", null);
        //se coloca la cantidad máxima
        cantidad_actual.value = document.getElementById("cantidadR").innerHTML.slice(11);
    }
    //se limpia de ceros inncesarios
    cantidad_actual.value = Number(cantidad_actual.value);
}

//función que envia el producto al carrito

function enviar(id) {
    //Se crea una variable de tipo form
    let dato = new FormData();
    //se llena con el ID
    dato.append("identificador", id);
    //se busca la cantidad del producto
    fetch(API_detalle + "cantidad", {
        method: "post",
        body: dato,
    }).then(function (request) {
        //Se verifica que la sentencia se haya ejecutado
        if (request.ok) {
            //Se convierte la petición en formato JSON
            request.json().then(function (response) {
                //Se crea la variable donde se guardarán los datos
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status == 1) {
                    //se guarda el dato
                    data = response.dataset;
                    //se verifica si se puede comprar (cantidad)
                    if (document.getElementById("cantidad").value < data.cantidad) {
                        //se verifica si existe una orden en proceso
                        fetch(API_detalle + "activo", {
                            method: "get",
                        }).then(function (request) {
                            //Se verifica que la sentencia se haya ejecutado
                            if (request.ok) {
                                //Se convierte la petición en formato JSON
                                request.json().then(function (response) {
                                    //Se crea la variable donde se guardarán los datos
                                    let data = new FormData();
                                    // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                                    if (response.status == 1) {
                                        //se guarda el identificador de la orden en proceso
                                        data.append(
                                            "identificador",
                                            response.dataset.id_orden_compra
                                        );
                                        //se guarda la cantidad del producto
                                        data.append(
                                            "cantidad",
                                            document.getElementById("cantidad").value
                                        );
                                        //se guarda el identificador del producto
                                        data.append("producto", id);
                                        //se agrega el nuevo detalle y se guarda
                                        fetch(API_detalle + "agregarProducto", {
                                            method: "post",
                                            body: data,
                                        }).then(function (request) {
                                            //Se verifica que la sentencia se haya ejecutado
                                            if (request.ok) {
                                                //Se convierte la petición en formato JSON
                                                request.json().then(function (response) {
                                                    // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                                                    if (response.status) {
                                                        sweetAlert(1, response.message, null);
                                                        //si todo está bien se actualiza la vista
                                                    } else {
                                                        sweetAlert(2, response.exception, null);
                                                    }
                                                });
                                            } else {
                                                //Se imprime el problema al ejecutar la sentencia
                                                console.log(
                                                    request.status + " " + request.statusText
                                                );
                                            }
                                        });
                                    } else if (response.status == 2) {
                                        //No hay orden activa, se procede a crear una nueva
                                        //Se crea la variable donde se guardarán los datos
                                        let data = new FormData();
                                        //se guarda la cantidad del producto
                                        data.append(
                                            "cantidad",
                                            document.getElementById("cantidad").value
                                        );
                                        //se guarda el identificador del producto
                                        data.append("producto", id);
                                        //se crea la orden
                                        fetch(API_detalle + "crearOrden", {
                                            method: "post",
                                            body: data,
                                        }).then(function (request) {
                                            //Se verifica que la sentencia se haya ejecutado
                                            if (request.ok) {
                                                //Se convierte la petición en formato JSON
                                                request.json().then(function (response) {
                                                    // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                                                    if (response.status) {
                                                        sweetAlert(1, response.message, null);
                                                        //si todo está bien se actualiza la vista
                                                    } else {
                                                        sweetAlert(2, response.exception, null);
                                                    }
                                                });
                                            } else {
                                                //Se imprime el problema al ejecutar la sentencia
                                                console.log(
                                                    request.status + " " + request.statusText
                                                );
                                            }
                                        });
                                    } else {
                                        sweetAlert(2, response.exception, null);
                                    }
                                });
                            } else {
                                //Se imprime el problema al ejecutar la sentencia
                                console.log(request.status + " " + request.statusText);
                            }
                        });
                    } else {
                        sweetAlert(
                            3,
                            "La cantidad ingresada es mayor a la cantidad disponible",
                            null
                        );
                    }
                } else if (response.status == 2) {
                    sweetAlert(3, response.exception, null);
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

//función que carga los comentarios del producto

function cargarComentarios(id) {
    //Se crea la variable de tipo form
    let datos = new FormData();
    //se llena con el id del producto
    datos.append('producto',id);
    //se obtiene los comentarios
    fetch(API_detalle + "obtenerComentarios", {
        method: "post",
        body: datos,
    }).then(function (request) {
        //Se verifica que la sentencia se haya ejecutado
        if (request.ok) {
            //Se convierte la petición en formato JSON
            request.json().then(function (response) {
                //Se crea la variable donde se guardarán los datos
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //se llena con los resultados
                    data = response.dataset;
                    //se crea la variable donde se guardará el html de la inyección
                    let contenido = [];
                    //se recorre el array
                    data.map(function (row) {
                        //se llena con el contenido a colocar
                        contenido += `
                        <div class="card valoracion_card">
                            <div class="row valign-wrapper">
                                <div class="col l3 m3 s12">
                                    <p>${row.nombre_cliente}</p>
                                </div>
                        `;
                        switch (row.calificacion) {
                            case 1:
                                contenido += `
                                <div class="col l2 m2 s4">
                                    <div class="estrellas_contenedor">
                                        <input
                                            id="star1"
                                            type="radio"
                                            value="5"
                                            disabled="disabled"
                                        />
                                        <label for="star1">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star2"
                                            type="radio"
                                            value="4"
                                            disabled="disabled"
                                        />
                                        <label for="star2">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star3"
                                            type="radio"
                                            value="3"
                                            disabled="disabled"
                                        />
                                        <label for="star3">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star4"
                                            type="radio"
                                            value="2"
                                            disabled="disabled"
                                        />
                                        <label for="star4">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star5"
                                            type="radio"
                                            value="1"
                                            disabled="disabled"
                                            checked
                                        />
                                        <label for="star5">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                    </div>
                                </div>
                                `;
                                break;
                            case 2:
                                contenido += `
                                    <div class="estrellas_contenedor">
                                        <input
                                            id="star1"
                                            type="radio"
                                            value="5"
                                            disabled="disabled"
                                        />
                                        <label for="star1">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star2"
                                            type="radio"
                                            value="4"
                                            disabled="disabled"
                                        />
                                        <label for="star2">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star3"
                                            type="radio"
                                            value="3"
                                            disabled="disabled"
                                        />
                                        <label for="star3">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star4"
                                            type="radio"
                                            value="2"
                                            disabled="disabled"
                                            checked
                                        />
                                        <label for="star4">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star5"
                                            type="radio"
                                            value="1"
                                            disabled="disabled"
                                        />
                                        <label for="star5">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                    </div>
                                `;
                                break;
                            case 3:
                                contenido += `
                                    <div class="estrellas_contenedor">
                                        <input
                                            id="star1"
                                            type="radio"
                                            value="5"
                                            disabled="disabled"
                                        />
                                        <label for="star1">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star2"
                                            type="radio"
                                            value="4"
                                            disabled="disabled"
                                            checked
                                        />
                                        <label for="star2">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star3"
                                            type="radio"
                                            value="3"
                                            disabled="disabled"
                                            checked
                                        />
                                        <label for="star3">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star4"
                                            type="radio"
                                            value="2"
                                            disabled="disabled"
                                        />
                                        <label for="star4">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star5"
                                            type="radio"
                                            value="1"
                                            disabled="disabled"
                                        />
                                        <label for="star5">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                    </div>
                                `;
                                break;
                            case 4:
                                contenido += `
                                    <div class="estrellas_contenedor">
                                        <input
                                            id="star1"
                                            type="radio"
                                            value="5"
                                            disabled="disabled"
                                            
                                        />
                                        <label for="star1">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star2"
                                            type="radio"
                                            value="4"
                                            disabled="disabled"
                                            checked
                                        />
                                        <label for="star2">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star3"
                                            type="radio"
                                            value="3"
                                            disabled="disabled"
                                        />
                                        <label for="star3">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star4"
                                            type="radio"
                                            value="2"
                                            disabled="disabled"
                                        />
                                        <label for="star4">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star5"
                                            type="radio"
                                            value="1"
                                            disabled="disabled"
                                        />
                                        <label for="star5">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                    </div>
                                `;
                                break;
                            case 5:
                                contenido += `
                                    <div class="estrellas_contenedor">
                                        <input
                                            id="star1"
                                            type="radio"
                                            value="5"
                                            disabled="disabled"
                                            checked
                                        />
                                        <label for="star1">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star2"
                                            type="radio"
                                            value="4"
                                            disabled="disabled"
                                        />
                                        <label for="star2">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star3"
                                            type="radio"
                                            value="3"
                                            disabled="disabled"
                                        />
                                        <label for="star3">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star4"
                                            type="radio"
                                            value="2"
                                            disabled="disabled"
                                            checked
                                        />
                                        <label for="star4">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                        <input
                                            id="star5"
                                            type="radio"
                                            value="1"
                                            disabled="disabled"
                                        />
                                        <label for="star5">
                                            <i class="material-icons estrella">star</i>
                                        </label>
                                    </div>
                                `;
                                break;
                        }
                        contenido += `
                                    <div class="col l6 m7 s8">
                                        <p>${row.resena}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            `;
                    });
                    document.getElementById("cartas-valoraciones").innerHTML = contenido;
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
