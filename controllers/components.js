/*
 * Controlador general para las paginas web
 */

/*
 *  Ruta del servidor
 */
//const SERVER = "http://localhost/ProCulinaryShop-2/api/";
const SERVER = "https://proculinaryshop.herokuapp.com/api/";

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

function leerTablas(api, action) {
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
                llenarTabla(data);
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

function guardarRegistro(api, action, form, modal) {
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
function cargarSelect(endpoint, select, selected, active) {
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
                        contenido += "<option disabled selected value='0'>Seleccione una opción</option>";
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

function cargarDatosActualizar(api, action, identificador) {
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

function actualizarRegistro(API, action, form, modal) {
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

function eliminarRegistro(API, action, form, mensaje, action2) {
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
                    leerTablas(API, action2);
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
                llenarTabla(data);
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
    var chart = new Chartist.Line(
        CLASS,
        {
            labels: cabeceras,
            series: [datos],
        },
        {
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: "middle",
                }),
            ],
        },
        {
            fullWidth: true,
            chartPadding: {
                right: 100,
            },
            low: 0,
        }
    );
    /* --Código para que se encuentre animado---- */
    var seq = 0,
        delays = 100,
        durations = 500;

    //Se reinicia la animación
    chart.on("created", function () {
        seq = 0;
    });

    //Se dibuja los elementos usando la API de Chartist
    chart.on("draw", function (data) {
        seq++;

        if (data.type === "line") {
            //Se especifican la opacidad y las animacion de las lineas usando ccs3
            data.element.animate({
                opacity: {
                    //Se especifica el delay antes de seguir o cambiar de fase
                    begin: seq * delays + 500,
                    //Duración de la animación
                    dur: durations,
                    //El valor donde se iniciará la animación
                    from: 0,
                    //El valor donde finalizará la animación
                    to: 1,
                },
            });
        } else if (data.type === "label" && data.axis === "x") {
            data.element.animate({
                y: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.y + 100,
                    to: data.y,
                    easing: "easeOutQuart",
                },
            });
        } else if (data.type === "label" && data.axis === "y") {
            data.element.animate({
                x: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 100,
                    to: data.x,
                    easing: "easeOutQuart",
                },
            });
        } else if (data.type === "point") {
            data.element.animate({
                x1: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 10,
                    to: data.x,
                    easing: "easeOutQuart",
                },
                x2: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 10,
                    to: data.x,
                    easing: "easeOutQuart",
                },
                opacity: {
                    begin: seq * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: "easeOutQuart",
                },
            });
        } else if (data.type === "grid") {
            //Animaciones para las líneas
            var pos1Animation = {
                begin: seq * delays,
                dur: durations,
                from: data[data.axis.units.pos + "1"] - 30,
                to: data[data.axis.units.pos + "1"],
                easing: "easeOutQuart",
            };

            var pos2Animation = {
                begin: seq * delays,
                dur: durations,
                from: data[data.axis.units.pos + "2"] - 100,
                to: data[data.axis.units.pos + "2"],
                easing: "easeOutQuart",
            };

            var animations = {};
            animations[data.axis.units.pos + "1"] = pos1Animation;
            animations[data.axis.units.pos + "2"] = pos2Animation;
            animations["opacity"] = {
                begin: seq * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: "easeOutQuart",
            };

            data.element.animate(animations);
        }
    });

    //Reanimación de la gráfica
    chart.on("created", function () {
        if (window.__exampleAnimateTimeout) {
            clearTimeout(window.__exampleAnimateTimeout);
            window.__exampleAnimateTimeout = null;
        }
        window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 18000);
    });
}

//función de línea simple
function linea(CLASS, cabeceras, datos) {
var chart = new Chartist.Line(
    CLASS,
    {
        labels: [1, 2, 3, 4, 5, 6, 7],
        series: [
            [1, 5, 3, 4, 6, 2, 3],
            [2, 4, 2, 5, 4, 3, 6],
        ],
    },
    {
        plugins: [Chartist.plugins.tooltip()],
    }
);
}

//Función de barras
function barras(CLASS, cabeceras, datos) {
    //Se crea el gráfico
    new Chartist.Bar(
        CLASS,
        {
            labels: cabeceras,
            series: datos,
        },
        {
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: "top",
                }),
            ],
        },
        {
            seriesBarDistance: 10,
            reverseData: true,
            horizontalBars: true,
            axisY: {
                offset: 70,
            },
            axisX: {
                onlyInteger: true,
                offset: 20,
            },
        }
    );
}

function semiPastel(CLASS, titulos, datos) {
    //Se crea un arreglo donde guardar todos los datos
    var data = {
        labels: titulos,
        series: datos,
    };

    //Se crean los datos
    var chart = new Chartist.Pie(
        CLASS,
        data,
        {
            donut: true,
            showLabel: true,
        },
        {
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: "middle",
                }),
            ],
        }
    );
    chart.on("draw", function (data) {
        if (data.type === "slice") {
            //Se obtiene la ruta
            var pathLength = data.element._node.getTotalLength();

            //Se toman las coordenadas y limites de dónde puede llegar
            data.element.attr({
                "stroke-dasharray": pathLength + "px " + pathLength + "px",
            });

            //Preferencias de animación
            var animationDefinition = {
                "stroke-dashoffset": {
                    id: "anim" + data.index,
                    dur: 450,
                    from: -pathLength + "px",
                    to: "0px",
                    easing: Chartist.Svg.Easing.easeOutQuint,
                    fill: "freeze",
                },
            };

            //Tiempo de animación entre cambios
            if (data.index !== 0) {
                animationDefinition["stroke-dashoffset"].begin = "anim" + (data.index - 1) + ".end";
            }

            data.element.attr({
                "stroke-dashoffset": -pathLength + "px",
            });

            //Animaciones
            data.element.animate(animationDefinition, false);
        }
    });

    //Repetición de la animación
    chart.on("created", function () {
        if (window.__anim21278907124) {
            clearTimeout(window.__anim21278907124);
            window.__anim21278907124 = null;
        }
        window.__anim21278907124 = setTimeout(chart.update.bind(chart), 18000);
    });
}

//función para crear una gráfica de pastel completa
function pastel(CLASS, cabeceras, datos) {
    var data = {
        labels: cabeceras,
        series: datos,
    };

    var options = {
        labelInterpolationFnc: function (value) {
            return value[0];
        },
    };

    var responsiveOptions = [
        [
            "screen and (min-width: 640px)",
            {
                chartPadding: 30,
                labelOffset: 100,
                labelDirection: "explode",
                labelInterpolationFnc: function (value) {
                    return value;
                },
            },
        ],
        [
            "screen and (min-width: 1024px)",
            {
                labelOffset: 80,
                chartPadding: 20,
            },
        ],
    ];

    new Chartist.Pie(CLASS, data, options, responsiveOptions);
}

/**
 *  Explicación de margenes
 *  1 cm = 28.34 pt
 *  1.5 cm = 42 pt
 */

//Función para crear un pdf de tipo tabla
function reporteTablas(cabeceras, datos, nombre, titulo) {
    //Se agrega los primeros datos
    const doc = new jspdf.jsPDF("p", "pt", "letter"),
        margin = {
            top: 210,
            bottom: 80,
            left: 43,
            right: 43,
        };
    //Petición para obtener el nombre actual del usuario
    fetch(SERVER + "private/api_login.php?action=" + "obtenerSesion", {
        method: "get",
    }).then(function (request) {
        //Se verifica el estado de la ejecución
        if (request.ok) {
            //Se pasa a JSON
            request.json().then(function (response) {
                //Se verifica el estado devuelto por la api
                if (response.status) {
                    //Se cargan los datos a la tabla junto con los estilos
                    doc.autoTable({
                        head: [cabeceras],
                        body: datos,
                        margin,
                        styles: { halign: "center", font: "courier-oblique" },
                        headStyles: { fillColor: [18, 143, 35] },
                        alternateRowStyles: { fillColor: [202, 247, 194] },
                        tableLineColor: [132, 241, 136],
                        tableLineWidth: 0.1,
                    });

                    //Se carga la imagen a colocar como header
                    var logo = new Image();
                    logo.src = "../../resources/img/reportes/cabecerawhite.png";

                    //Se agrega el conteo de páginas
                    const pageCount = doc.internal.getNumberOfPages();
                    for (var i = 1; i <= pageCount; i++) {
                        //Selección de la página para colocar los datos
                        doc.setPage(i);

                        //Se agregan estilos el titulo
                        doc.setFont("courier-oblique");
                        doc.setFontSize(22);
                        doc.setTextColor(76, 175, 80);
                        //Se coloca el titulo de la página, se colocará en el centro
                        doc.text(titulo, doc.internal.pageSize.getWidth() / 2, 185, {
                            align: "center",
                        });

                        //Se coloca el banner del header
                        doc.addImage(logo, "PNG", 43, 43, 532, 110);

                        //Se agrega la decoración y pie de página
                        doc.setDrawColor(0);
                        doc.setFillColor(18, 143, 36);
                        doc.rect(42, 700, 530, 50, "F");

                        //Se reestablecen los estilos
                        doc.setFontSize(12);
                        doc.setTextColor(255, 255, 255);
                        doc.text("Usuario: " + response.dataset, 60, 80);
                        //Se cambia el idioma de la hora
                        moment.locale("es");
                        //Se coloca el pie de página con el número de letra
                        doc.text("Fecha: " + moment().format("dddd de MMMM YYYY, h:mm a"), 60, 120);
                        //Se reestablecen los estilos
                        doc.setFontSize(10);
                        doc.setTextColor(255, 255, 255);
                        //Se coloca la número de página
                        doc.text(500, 730, "Página " + String(i) + " de " + String(pageCount));
                        //Se coloca el nombre de la empresa
                        doc.text(80, 730, "ProCulinaryShop S.A. de C.V.");
                    }

                    //Se guarda el documento
                    doc.save(`${nombre}.pdf`);
                } else {
                    //Se muestra el error
                    sweetAlert(3, response.exception, null);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}

/**
 *  Explicación de margenes
 *  1 cm = 28.34 pt
 *  1.5 cm = 42 pt
 */

//Función para crear un pdf con multitablas
function reporteMultitablas(cabeceras, datos, nombre, titulos) {
    //Se datos generales del documento
    const doc = new jspdf.jsPDF("p", "pt", "letter"),
        margin = {
            top: 210,
            bottom: 80,
            left: 43,
            right: 43,
        };
    //Petición para obtener el nombre actual del usuario
    fetch(SERVER + "private/api_login.php?action=" + "obtenerSesion", {
        method: "get",
    }).then(function (request) {
        //Se verifica el estado de la ejecución
        if (request.ok) {
            //Se pasa a JSON
            request.json().then(function (response) {
                //Se verifica el estado devuelto por la api
                if (response.status) {
                    /*
                     *   Se revisa la cantidad de titulos recibidos, para luego
                     *   calcular la cantidad de páginas
                     */

                    for (let index = 0; index < titulos.length - 1; index++) {
                        //Se agregan estilos el titulo
                        doc.setFont("courier-oblique");
                        doc.setFontSize(22);
                        doc.setTextColor(76, 175, 80);
                        //Se coloca el titulo de la página
                        doc.text(titulos[index], doc.internal.pageSize.getWidth() / 2, 185, {
                            align: "center",
                        });
                        //Se cargan los datos a la tabla y sus estilos
                        doc.autoTable({
                            head: [cabeceras[index]],
                            body: datos[index],
                            margin,
                            styles: { halign: "center", font: "courier-oblique" },
                            headStyles: { fillColor: [18, 143, 35] },
                            alternateRowStyles: { fillColor: [202, 247, 194] },
                            tableLineColor: [132, 241, 136],
                            tableLineWidth: 0.1,
                        });
                        //Se agrega una nueva página
                        doc.addPage();
                    }

                    //Se agrega la última tabla del reporte

                    //Se coloca el titulo de la página
                    doc.text(titulos[titulos.length - 1], doc.internal.pageSize.getWidth() / 2, 185, {
                        align: "center",
                    });
                    //Se cargan los datos a la tabla
                    doc.autoTable({
                        head: [cabeceras[cabeceras.length - 1]],
                        body: datos[datos.length - 1],
                        margin,
                        styles: { halign: "center", font: "courier-oblique" },
                        headStyles: { fillColor: [18, 143, 35] },
                        alternateRowStyles: { fillColor: [202, 247, 194] },
                        tableLineColor: [132, 241, 136],
                        tableLineWidth: 0.1,
                    });

                    //Se carga la imagen a colocar como header
                    var logo = new Image();
                    logo.src = "../../resources/img/reportes/cabecerawhite.png";

                    //Se agrega el conteo de páginas
                    const pageCount = doc.internal.getNumberOfPages();
                    for (var i = 1; i <= pageCount; i++) {
                        //Selección de la página para colocar los datos
                        doc.setPage(i);

                        //Se coloca el banner del header
                        doc.addImage(logo, "PNG", 43, 43, 532, 110);

                        //Se agrega la decoración y pie de página
                        doc.setDrawColor(0);
                        doc.setFillColor(18, 143, 36);
                        doc.rect(42, 700, 530, 50, "F");

                        //Se reestablecen los estilos
                        doc.setFont("courier-oblique");
                        doc.setFontSize(12);
                        doc.setTextColor(255, 255, 255);
                        //Se coloca el nombre de quién está realizando el reporte
                        doc.text("Usuario: " + response.dataset, 60, 80);
                        //Se cambia el idioma de la hora
                        moment.locale("es");
                        //Se coloca la hora en que se está realizando el reporte
                        doc.text("Fecha: " + moment().format("dddd de MMMM YYYY, h:mm a"), 60, 120);
                        //Se coloca el pie de página con el número de letra
                        doc.setFontSize(10);
                        doc.setTextColor(255, 255, 255);
                        //Se coloca el número de página
                        doc.text(500, 730, "Página " + String(i) + " de " + String(pageCount));
                        //Se coloca el nombre de la empresa
                        doc.text(80, 730, "ProCulinaryShop S.A. de C.V.");
                    }

                    //Se guarda el documento
                    doc.save(`${nombre}.pdf`);
                } else {
                    //Se muestra el error
                    sweetAlert(3, response.exception, null);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}

/**
 *  Explicación de margenes
 *  1 cm = 28.34 pt
 *  1.5 cm = 42 pt
 */

//Función para crear un reporte de tipo factura
function comprobante(cabeceras, datos, nombre, titulo) {
    //Se colocan los datos generales de la gráfica
    const doc = new jspdf.jsPDF("p", "pt", "letter"),
        margin = {
            top: 250,
            bottom: 80,
            left: 43,
            right: 43,
        };
    //Petición para obtener el nombre actual del usuario
    fetch(SERVER + "public/api_login.php?action=" + "obtenerSesion", {
        method: "get",
    }).then(function (request) {
        //Se verifica el estado de la ejecución
        if (request.ok) {
            //Se pasa a JSON
            request.json().then(function (response) {
                //Se verifica el estado devuelto por la api
                if (response.status) {
                    //Se cargan los datos a la tabla y sus estilos
                    doc.autoTable({
                        head: [cabeceras],
                        body: datos,
                        margin,
                        styles: { halign: "center", font: "courier-oblique" },
                        headStyles: { fillColor: [18, 143, 35] },
                        alternateRowStyles: { fillColor: [202, 247, 194] },
                        tableLineColor: [132, 241, 136],
                        tableLineWidth: 0.1,
                    });

                    //Se carga la imagen a colocar como header
                    var logo = new Image();
                    logo.src = "../../resources/img/logoblack.png";

                    //Se agrega el conteo de páginas
                    const pageCount = doc.internal.getNumberOfPages();
                    for (var i = 1; i <= pageCount; i++) {
                        //Selección de la página para colocar los datos
                        doc.setPage(i);

                        //Se agregan estilos el titulo
                        doc.setFont("courier-oblique");
                        doc.setFontSize(22);
                        doc.setTextColor(76, 175, 80);
                        //Se coloca el titulo de la página en el centro
                        doc.text(titulo, doc.internal.pageSize.getWidth() / 2, 230, {
                            align: "center",
                        });

                        //Se agrega la decoración y pie de página
                        doc.setDrawColor(0);
                        doc.setFillColor(18, 143, 36);
                        doc.rect(320, 43, 350, 70, "F");
                        doc.rect(42, 700, 530, 50, "F");

                        //Se coloca el banner del header
                        doc.addImage(logo, "PNG", 43, 30, 250, 90);

                        //Se reestablecen los estilos
                        doc.setFontSize(12);
                        doc.setFont("courier-oblique");
                        doc.setTextColor(0, 0, 0);
                        //Se coloca el nombre del cliente
                        doc.text("Cliente: " + response.dataset.cliente, 80, 175);
                        //Se coloca el número de la factura
                        doc.text("N° de factura: " + response.dataset.id_orden_compra, 370, 150);

                        //Se cambia el idioma de la hora
                        moment.locale("es");
                        //Se coloca la hora de emisión
                        doc.text("Fecha: " + moment().format("dd de MMMM YYYY, h:mm a"), 370, 175);
                        //Se reestablecen los estilos
                        doc.setFontSize(14);
                        doc.setTextColor(0, 0, 0);
                        //Se coloca el nombre de la empresa en el encabezado
                        doc.text("ProCulinaryShop S.A. de C.V", 80, 125);
                        //Se coloca el pie de página con el número de letra
                        doc.setFontSize(10);
                        doc.setTextColor(255, 255, 255);
                        //Se coloca la página actual
                        doc.text(500, 730, "Página " + String(i) + " de " + String(pageCount));
                        //Se coloca el nombre de la empresa en el footer
                        doc.text(80, 730, "ProCulinaryShop S.A. de C.V.");
                    }

                    //Se guarda el documento
                    doc.save(`${nombre}.pdf`);
                } else {
                    //Se muestra el error
                    sweetAlert(3, response.exception, null);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}
