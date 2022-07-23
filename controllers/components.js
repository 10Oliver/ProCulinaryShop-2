/*
 * Controlador general para las paginas web
 */

/*
 *  Ruta del servidor
 */
const SERVER = "http://localhost/ProCulinaryShop-2/api/";


/*
 * Función que carga las tablas en las vistas
 *
 * Para que funcione necesita:
 *  - API: Ruta donde se encuentra la API a utilizar
 *  - action: Nombre de la función en la API a ejecutar
 *
 *  ------------------------------------------------------
 *                  Nota importante
 *  La función llenar_tabla es el nombre de la función en el
 *  controlador, debe de llamarse de esa manera siempre
 *
 *  Esta acción solo puede ser usa mediante controladores
 *  externos al components.js
 * -------------------------------------------------------
 *
 * Se retorna todos los registros de la consulta
 */

function leertablas(api, action) {
    fetch(api + action, {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                //Se crea la variable donde se guardarán los datos
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                } else {
                    data = response.dataset;
                    sweetAlert(4, response.exception, null);
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
                llenar_tabla(data);
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

/*
 * Función que guarda los nuevos empleados
 *
 * Se necesitan:
 *
 *  - api: ruta del modelo que se ejecutará
 *  - action: método que ejecutará el modelo
 *  - form: id del formulario donde se mandarán los datos
 *  - modal: id del modal
 *
 * Se retorna todos los registros de la consulta
 */

function guardar_registro(api, action, form, modal) {
    fetch(api + action, {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON, servirá para el mensaje
            request.json().then(function (response) {
                //Se confirma si la sentencia fue ejecutada correctamente
                if (response.status) {
                    // Se cierra el modal del formulario
                    M.Modal.getInstance(document.getElementById(modal)).close();
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

/**
 *  Función que llenará los cargos disponibles en un select
 *
 *  Se necesitan:
 *  - endpoint: ruta del modelo que se ejecutará
 *  - select: id del select que se ejecutará
 *  - selected: Si existe un valor seleccionado
 *  - active: Si la opción por defecto se podrá seleccionar
 *  - active¬¬ Null = sin activacion 1 = activado
 *
 *  retorna los datos para que sean cargados en el controllador
 */
function cargar_select(endpoint, select, selected, active) {
    fetch(endpoint, {
        method: "get",
    }).then(function (request) {
        //Se verifica si la ejecución es correcta, de lo contrario se mostrará el error en la consola
        if (request.ok) {
            //se convierte la respuesta a un JSON
            request.json().then(function (response) {
                //Se crea la variable donde se guardará el HTML para inyectarlo en la página
                let contenido = "";
                //Se verifica si la respuesta es satisfactoria, de lo contrario se recibe el problema
                if (response.status) {
                    //Se verifica si se quiere que la opción por defecto se pueda seleccionar
                    if (active) {
                        contenido += "<option selected value='0'>Seleccione una opción</option>";
                    }
                    //Si no hay un opcion preseleccionada, se asignara la indicacion de que seleccione una
                    if (!selected && !active) {
                        //Se agrega la opción "Selecciona una opción" la cual estará deshabilitada
                        contenido +=
                            "<option disabled selected value='0'>Seleccione una opción</option>";
                    }
                    //Se recorre todo el vector devuelto para agregarlos al select
                    response.dataset.map(function (fila) {
                        //Se desglosa el resultado obtenido en el valor y la opcion
                        valor = Object.values(fila)[0];
                        texto = Object.values(fila)[1];
                        //Se cargan las opciones en la inyección HTML
                        //Si existe un valor por seleccionar se le tomará tal dato
                        if (valor == selected) {
                            //Opcion seleccionada
                            contenido += `<option value="${valor}" selected>${texto}</option>`;
                        } else {
                            //Opción libre
                            contenido += `<option value="${valor}">${texto}</option>`;
                        }
                    });
                } else {
                    //Si no hay opciones disponibles
                    contenido += "<option disabled selected>No hay opciones disponible</option>";
                }
                //Se añaden las opciones al select usando su id
                document.getElementById(select).innerHTML = contenido;
                //Se inicializa el componente para que funcione con Materialize
                M.FormSelect.init(document.querySelectorAll("select"));
            });
        } else {
            //Se notifica el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}

/**
 *  Función que llamará los datos del modal
 *
 *  Se necesitan:
 *  API: Dirección de la APi que se ejuctará
 *  action: Nombre de la función que se ejecutará
 *  identificador: id del registro que se buscará los datos
 *
 *
 *  Cargará los datos directamente al select
 *
 */

function cargar_datos_actualizar(api, action, identificador) {
    fetch(api + action, {
        method: "post",
        body: identificador,
    }).then(function (response) {
        //Se verifica si se ejecutó la sentencia
        if (response.ok) {
            //Se obtiene la respuesta en JSON
            response.json().then(function (request) {
                //Se verifica si el estado de la respuesta
                if (request.status) {
                    return request;
                } else {
                    sweetAlert(2, response.exception, null);
                    return false;
                }
            });
        } else {
            console.log("hubo un probla en el componente");
        }
    });
}

/**
 *  Función que actualizará el registro seleccionado
 *
 *  Para que funcioné se necesitará:
 *  - API: Dirección de la api
 *  - action: Acción que se realizará en la API selecionada
 *  - form: ID del formulario donde están los datos
 *  - modal: El ID del modal para cerrarlo
 *
 *  No devolverá ningún datos, solo la confirmación
 */

function actualizar_registro(API, action, form, modal) {
    fetch(API + action, {
        method: "post",
        body: new FormData(document.getElementById(form)),
    }).then(function (request) {
        //Se revisa si la sentencia pudo ser ejecutada
        if (request.ok) {
            //Se convierte el resultado a formato JSON
            request.json().then(function (response) {
                //Se verifica que los datos obtenidos sean satisfactorios
                if (response.status) {
                    //Se cierra el formulario
                    M.Modal.getInstance(document.getElementById(modal)).close();
                    //Se muestra la confirmación de la actualización
                    sweetAlert(1, response.message, null);
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
}

/**
 *  Función que elimina un registro
 *
 *  Para que funcione se necesitará:
 *  - API: Dirección de la API que se ejcutará
 *  - action: Función que se ejecutará dentro de la API
 *  - form: ID del indentificador del registro
 *  - mensaje: Texto a mostrar en la alerta
 *  - action2: Función que se ejecutará para recargar la tabla (Se envía a otra función)
 *
 *  No devolverá valor, solo las confirmaciones
 */

function eliminar_registro(API, action, form, mensaje, action2) {
    if (mensaje == null) {
        mensaje = "¿Está seguro de eliminar el registro?";
    }
    swal({
        title: "Advertencia",
        text: mensaje,
        icon: "warning",
        buttons: ["No", "Sí"],
        closeOnClickOutside: false,
        closeOnEsc: false,
    }).then(function (valor) {
        if (valor) {
            fetch(API + action, {
                method: "post",
                body: form,
            }).then(function (request) {
                //Se verifica si la sentencia fue ejecutada correctamente
                if (request.ok) {
                    //Se convierte la petición a formato JSON
                    request.json().then(function (response) {
                        //Se verifica si la respuesta obtenida es satisfactoria
                        if (response.status) {
                            //Se le muestra la confirmación al usuario
                            sweetAlert(1, response.message, null);
                        } else {
                            //Se muestra el error
                            sweetAlert(2, response.exception, null);
                        }
                    });
                    //S refresca la tabla de datos
                    leertablas(API, action2);
                } else {
                    console.log(request.status + " " + request.statusText);
                }
            });
        }
    });
}

/**
 *  Función que realizará la busqueda de los datos
 *
 *  Se necesitan:
 *  - API: Dirección de la API a utilizar
 *  - action: Función que ejecutará la API
 *  - form: Objeto de tipo form, con el que se mandarán los datos
 *
 *  No devolverá nada, pero cargará los datos en la página
 */

function buscar(API, action, form) {
    fetch(API + action, {
        method: "post",
        body: form,
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
}

//Función para las alertas

function sweetAlert(type, text, url) {
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = "Éxito";
            icon = "success";
            break;
        case 2:
            title = "Error";
            icon = "error";
            break;
        case 3:
            title = "Advertencia";
            icon = "warning";
            break;
        case 4:
            title = "Aviso";
            icon = "info";
    }
    // Si existe una ruta definida, se muestra el mensaje y se direcciona a dicha ubicación, de lo contrario solo se muestra el mensaje.
    if (url) {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: "Aceptar",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then(function () {
            location.href = url;
        });
    } else {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: "Aceptar",
            closeOnClickOutside: false,
            closeOnEsc: false,
        });
    }
}


//Función para crear una gráfica líneal con puntos interpolados
function lineaI(CLASS, cabeceras, datos) { 
    //Se crea la gráfica a base de la clase y los datos
    var chart = new Chartist.Line(CLASS, {
        labels: cabeceras,
        series: [
            datos
        ],
    }, {
        fullWidth: true,
        chartPadding: {
            right: 100
        },
        low: 0
    });
    /* --Código para que se encuentre animado---- */
    var seq = 0,
        delays = 80,
        durations = 500;

   //Se reinicia la animación
    chart.on('created', function () {
        seq = 0;
    });

    //Se dibuja los elementos usando la API de Chartist
    chart.on('draw', function (data) {
        seq++;

        if (data.type === 'line') {
            //Se especifican la opacidad y las animacion de las lineas usando ccs3
            data.element.animate({
                opacity: {
                    //Se especifica el delay antes de seguir o cambiar de fase
                    begin: seq * delays + 1000,
                    //Duración de la animación
                    dur: durations,
                    //El valor donde se iniciará la animación
                    from: 0,
                    //El valor donde finalizará la animación
                    to: 1
                }
            });
        } else if (data.type === 'label' && data.axis === 'x') {
            data.element.animate({
                y: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.y + 100,
                    to: data.y,
                    easing: 'easeOutQuart'
                }
            });
        } else if (data.type === 'label' && data.axis === 'y') {
            data.element.animate({
                x: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 100,
                    to: data.x,
                    easing: 'easeOutQuart'
                }
            });
        } else if (data.type === 'point') {
            data.element.animate({
                x1: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 10,
                    to: data.x,
                    easing: 'easeOutQuart'
                },
                x2: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 10,
                    to: data.x,
                    easing: 'easeOutQuart'
                },
                opacity: {
                    begin: seq * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: 'easeOutQuart'
                }
            });
        } else if (data.type === 'grid') {
            //Animaciones para las líneas
            var pos1Animation = {
                begin: seq * delays,
                dur: durations,
                from: data[data.axis.units.pos + '1'] - 30,
                to: data[data.axis.units.pos + '1'],
                easing: 'easeOutQuart'
            };

            var pos2Animation = {
                begin: seq * delays,
                dur: durations,
                from: data[data.axis.units.pos + '2'] - 100,
                to: data[data.axis.units.pos + '2'],
                easing: 'easeOutQuart'
            };

            var animations = {};
            animations[data.axis.units.pos + '1'] = pos1Animation;
            animations[data.axis.units.pos + '2'] = pos2Animation;
            animations['opacity'] = {
                begin: seq * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: 'easeOutQuart'
            };

            data.element.animate(animations);
        }
    });

  //Reanimación de la gráfica
    chart.on('created', function () {
        if (window.__exampleAnimateTimeout) {
            clearTimeout(window.__exampleAnimateTimeout);
            window.__exampleAnimateTimeout = null;
        }
        window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
    });
}

function barras(CLASS, cabeceras, datos) { 
    new Chartist.Bar(
        CLASS,
        {
            labels: cabeceras,
            series: [datos,datos],
        },
        {
            // Default mobile configuration
            stackBars: true,
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value
                        .split(/\s+/)
                        .map(function (word) {
                            return word[0];
                        })
                        .join("");
                },
            },
            axisY: {
                offset: 20,
            },
        },
        [
            // Options override for media > 400px
            [
                "screen and (min-width: 400px)",
                {
                    reverseData: true,
                    horizontalBars: true,
                    axisX: {
                        labelInterpolationFnc: Chartist.noop,
                    },
                    axisY: {
                        offset: 60,
                    },
                },
            ],
            // Options override for media > 800px
            [
                "screen and (min-width: 800px)",
                {
                    stackBars: false,
                    seriesBarDistance: 10,
                },
            ],
            // Options override for media > 1000px
            [
                "screen and (min-width: 1000px)",
                {
                    reverseData: false,
                    horizontalBars: false,
                    seriesBarDistance: 15,
                },
            ],
        ]
    );

}