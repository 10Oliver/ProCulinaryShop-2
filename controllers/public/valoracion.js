//Se crea la constante de la ruta a la API
const API_valoracion = SERVER + "public/api_valoracion.php?action=";
//variable global para obtener todos los ID
var identificadores = [];

//Se crea el método que cargará los datos al carrito cuando se cargue la página
document.addEventListener("DOMContentLoaded", function () {
    //Se cargan los datos en la vista, la función está en components.js
    leerTablas(API_valoracion, "cargarDatos");
});

//Funcion que llena la vista
function llenarTabla(dataset) {
    //Se crea la variable donde se guardarán los datos
    let contenido = "";
    //Se explora el vector fila por fila
    dataset.map(function (row) {
        //se llena con los id
        identificadores.push(row.id_detalle_orden);
        //Se ingresa el HTML a inyectar
        contenido += `
            <div class="card ">
                    <div class="row valign-wrapper">
                        <div class="col l3 m3 s12 center-align">
                             <img src="../../api/images/productos/${row.imagen}" alt="" class='imagen_producto_max'>
                            <p>${row.nombre_producto}</p>
                        </div>
                        <div class="col l3 m3 s12 center-align">
                            <div class="valoracion">
                                <!--Valoración-->
                                <h6>Calificación</h6>
                                <div class="estrellas_contenedor">
                                    <input id="star1${row.id_detalle_orden}" name="estrellas${row.id_detalle_orden}" type="radio" value="5" />
                                    <label for="star1${row.id_detalle_orden}"><i class="material-icons estrella">star</i></label>
                                    <input id="star2${row.id_detalle_orden}" name="estrellas${row.id_detalle_orden}" type="radio" value="4" />
                                    <label for="star2${row.id_detalle_orden}"><i class="material-icons estrella">star</i></label>
                                    <input id="star3${row.id_detalle_orden}" name="estrellas${row.id_detalle_orden}" type="radio" value="3" />
                                    <label for="star3${row.id_detalle_orden}"><i class="material-icons estrella">star</i></label>
                                    <input id="star4${row.id_detalle_orden}" name="estrellas${row.id_detalle_orden}" type="radio" value="2" />
                                    <label for="star4${row.id_detalle_orden}"><i class="material-icons estrella">star</i></label>
                                    <input id="star5${row.id_detalle_orden}" name="estrellas${row.id_detalle_orden}" type="radio" value="1" />
                                    <label for="star5${row.id_detalle_orden}"><i class="material-icons estrella">star</i></label>
                                    <input id="star0${row.id_detalle_orden}" name="estrellas${row.id_detalle_orden}" type="radio" value="0" class="hide" checked  /> 
                                </div>
                                                                     
                            </div>
                        </div>
                        <div class="col l5 m5 s12">
                            <div class="container input-field">
                                <input id="comentario${row.id_detalle_orden}" type="text" name="comentario${row.id_detalle_orden}" onkeypress="return letras_numeros(event)">
                                <label for="comentario${row.id_detalle_orden}">Comentario</label>
                            </div>

                        </div>
                    </div>
                </div>`;
    });
    //Se le insertan las filas a la tabla en la vista
    document.getElementById("listadoProductos").innerHTML = contenido;
}

//funcion que guardará los datos

function enviar() {
    //variable para confirmar que al menos un campo está lleno
    let validacion = [];
    //variable de estado
    let estado = 0;
    //se verifica en todos los campos que al menos uno de ellos esté lleno
    for (let index = 0; index < identificadores.length; index++) {
        //se verifica si la valoración por estrellas y el comentario están llenos
        if (
            document.querySelector(`input[name=estrellas${identificadores[index]}]:checked`)
                .value != 0 &&
            document.getElementById(`comentario${identificadores[index]}`).value.trim().length != 0
        ) {
            //se guarda el estado y el identificador
            validacion.push(identificadores[index]);
        }
    }

    //se verifica si al menos se guardó un registro completo
    if (validacion.length == 0) {
        sweetAlert(3, "Debes llenar al menos un producto (estrellas y valoración)", null);
    } else {
        //se verifica si al menos uno de todo está completo para guardar ese comentario
        for (let index = 0; index < validacion.length; index++) {
            //se crea la variable del tipo form data
            let datos = new FormData();
            //se llena con los datos
            datos.append("identificador", validacion[index]);
            datos.append(
                "comentario",
                document.getElementById("comentario" + validacion[index]).value
            );
            datos.append(
                "valoracion",
                document.querySelector(`input[name=estrellas${identificadores[index]}]:checked`)
                    .value
            );
            fetch(API_valoracion + "guardarValoracion", {
                method: "post",
                body: datos,
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON, servirá para el mensaje
                    request.json().then(function (response) {
                        //Se confirma si la sentencia fue ejecutada correctamente
                        if (response.status) {
                            estado++;
                        } else {
                            sweetAlert(2, response.exception, null);
                            return;
                        }
                    });
                } else {
                    console.log(request.status + " " + request.statusText);
                }
            });
        }
        //se comprueba el total de inserciones
        setTimeout(function () {
            if (estado == 0) {
                sweetAlert(2, "No se logró guardar tus valoraciones", null);
            } else if (estado > 0 && validacion.length > estado) {
                sweetAlert(2, "Uno o más valoraciones no fueron guardadas", null);
            } else {
                sweetAlert(1, "Tus valoraciones han sido guardadas con éxito", "index.html");
            }
        }, 700);
    }
}
