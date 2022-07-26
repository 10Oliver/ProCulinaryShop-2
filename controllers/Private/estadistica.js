// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_estadistica = SERVER + "private/api_estadistica.php?action=";
//Se declara un arreglo para obtener los id
var identificador = [];
//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    //Se realiza la petición para cargar los productos
    fetch(API_estadistica + "obtenerProductos", {
        method: "get",
    }).then(function (request) {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //se pasa a JSON
            request.json().then(function (response) {
                //se revisa el estado devuelto por la api
                if (response.status) {
                    //se crea la variable donde se insertarán los datos
                    let contenido = [];
                    //Se llena la tabla de opciones con las opciones disponibles
                    response.dataset.map(function (row) {
                        //Se carga el arreglo de id
                        identificador.push(row.id_producto);
                        contenido += `
                        <tr>
                            <td>${row.nombre_producto}</td>
                            <td>
                                <p>
                                    <label>
                                        <input type="checkbox" id="check${row.id_producto}"
                                         onclick="contar()"/>
                                        <span></span>
                                    </label>
                                    </p>
                            </td>
                        </tr>
                        `;
                    });
                    //Se inyecta a la tabla
                    document.getElementById("contenido").innerHTML = contenido;
                    contar();
                } else {
                    //se imprime el error
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });

    //Se realiza la petición para cargar los clientes
    fetch(API_estadistica + "cargarClientes", {
        method: "get",
    }).then(function (request) {
        //Se verifica el estado de la ejecución
        if (request.ok) {
            //Se pasa a JSON
            request.json().then(function (response) {
                //Se verifica el estado devuelto por la api
                if (response.status) {
                    //se crean las variables que almacerán los datos para la gráfica
                    let datos = [],
                        titulos = [];
                    //se guardan los datos por fila
                    response.dataset.map(function (row) {
                        titulos.push(row.nombre);
                        datos.push(row.total);
                    });
                    //vector general de datos
                    let general = [];
                    general.push(datos);
                    //se envían para general la gráfica
                    barras(".barras", titulos, general);
                } else {
                    barras(".barras", ["No se encontraron productos"], [0]);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
    //Se carga el componente de los sliders
    var dateSlider = document.getElementById("slider-cantidad");
    var dateSliderDinero = document.getElementById("slider-dinero");
    var dateSliderTrafico = document.getElementById("slider-trafico");

    function timestamp(str) {
        return new Date(str).getTime();
    }

    //Se le aplican las horas al slider
    noUiSlider.create(dateSlider, {
        // Rango máximo y minimo para el slider

        range: {
            min: timestamp(moment().subtract(1, "months").format("YYYY-MM-DD")),
            max: timestamp(moment()),
        },

        // Steps of one week
        step: 7 * 24 * 60 * 60 * 1000,

        // Posiciones iniciales
        start: [timestamp(moment().subtract(2, "days").format("YYYY-MM-DD")), timestamp(moment())],

        // Si se permitirán decimales o no
        format: wNumb({
            decimals: 0,
        }),
    });
    //Se le aplican las horas al slider
    noUiSlider.create(dateSliderTrafico, {
        // Rango máximo y minimo para el slider

        range: {
            min: timestamp(moment().subtract(1, "months").format("YYYY-MM-DD")),
            max: timestamp(moment()),
        },

        // Steps of one week
        step: 7 * 24 * 60 * 60 * 1000,

        // Posiciones iniciales
        start: [timestamp(moment().subtract(2, "days").format("YYYY-MM-DD")), timestamp(moment())],

        // Si se permitirán decimales o no
        format: wNumb({
            decimals: 0,
        }),
    });

    //Se le aplican las horas al slider
    noUiSlider.create(dateSliderDinero, {
        // Rango máximo y minimo para el slider

        range: {
            min: timestamp(moment().subtract(1, "months").format("YYYY-MM-DD")),
            max: timestamp(moment()),
        },

        // Steps of one week
        step: 7 * 24 * 60 * 60 * 1000,

        // Posiciones iniciales
        start: [timestamp(moment().subtract(2, "days").format("YYYY-MM-DD")), timestamp(moment())],

        // Si se permitirán decimales o no
        format: wNumb({
            decimals: 0,
        }),
    });

    //Obtención de los componentes a colocarles las fechas
    var dateValues = [document.getElementById("inicio"), document.getElementById("fin")];
    var valores = [document.getElementById("inicioI"), document.getElementById("finI")];
    var dateValuesDinero = [document.getElementById("inicioDinero"), document.getElementById("finDinero")];
    var valoresDinero = [document.getElementById("inicioDineroI"), document.getElementById("finDineroI")];

    var dateValuesTrafico = [document.getElementById("inicioTrafico"), document.getElementById("finTrafico")];
    var valoresTrafico = [document.getElementById("inicioTraficoI"), document.getElementById("finTraficoI")];

    //Opciones
    var formatter = new Intl.DateTimeFormat("es-ES", {
        dateStyle: "full",
    });

    var formatter1 = new Intl.DateTimeFormat("sv-SE", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
    });

    dateSlider.noUiSlider.on("update", function (values, handle) {
        valores[handle].value = formatter1.format(new Date(+values[handle]));
        dateValues[handle].innerHTML = formatter.format(new Date(+values[handle]));
        contar();
    });

    dateSliderDinero.noUiSlider.on("update", function (values, handle) {
        valoresDinero[handle].value = formatter1.format(new Date(+values[handle]));
        dateValuesDinero[handle].innerHTML = formatter.format(new Date(+values[handle]));
        dinero();
    });

    dateSliderTrafico.noUiSlider.on("update", function (values, handle) {
        valoresTrafico[handle].value = formatter1.format(new Date(+values[handle]));
        dateValuesTrafico[handle].innerHTML = formatter.format(new Date(+values[handle]));
    });
});

//Función que contará y llenará la gráfica

function contar() {
    //Se declará el array donde se guardarán los id que si usarán
    let id = [];
    for (let index = 0; index < identificador.length; index++) {
        //Se revisa si el checkbox está seleccionado
        if (document.getElementById("check" + identificador[index]).checked) {
            //Se guarda el id en los colocados
            id.push(identificador[index]);
        }
    }
    //se crea una variable de tipo fórmulario
    let datos = new FormData();
    //se cargan los datos
    datos.append("fechainicial", document.getElementById("inicioI").value);
    datos.append("fechafinal", document.getElementById("finI").value);
    datos.append("identificador", id);
    //Se realiza la petición
    fetch(API_estadistica + "productosTiempo", {
        method: "post",
        body: datos,
    }).then(function (request) {
        //Se verifica el estado de la ejecución
        if (request.ok) {
            //Se pasa a JSON
            request.json().then(function (response) {
                //Se verifica el estado devuelto por la api
                if (response.status) {
                    //se crean las variables que almacerán los datos para la gráfica
                    let datos = [],
                        titulos = [];
                    //se guardan los datos por fila
                    response.dataset.map(function (row) {
                        titulos.push(row.nombre_producto + " (" + row.total + ")");
                        datos.push(row.total);
                    });
                    //se envían para general la gráfica
                    semiPastel(".pastel", titulos, datos);
                } else {
                    semiPastel(".pastel", ["No se encontraron productos"], [100]);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Función para fechas de dinero
function dinero() {
    //Se crea una variable de tipo form
    let datos = new FormData();
    //Se llena con las fechas
    datos.append("fechainicial", document.getElementById("inicioDineroI").value);
    datos.append("fechafinal", document.getElementById("finDineroI").value);
    //Se realiza la petición a la api
    fetch(API_estadistica + "cargarDinero", {
        method: "post",
        body: datos,
    }).then(function (request) {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se convierte a json
            request.json().then(function (response) {
                //Se revisa el estado devuelto por la api
                if (response.status) {
                    //se crean las variables que almacerán los datos para la gráfica
                    let datos = [],
                        promedio = [],
                        total = [];
                    titulos = [];
                    //se guardan los datos por fila
                    response.dataset.map(function (row) {
                        titulos.push(row.fecha);
                        total.push(row.dinero);
                        promedio.push(row.promedio);
                    });
                    datos.push(promedio);
                    datos.push(total);
                    //se envían para general la gráfica
                    linea(".lineas", titulos, datos);
                } else {
                    linea(".lineas", ["No hay datos disponibles"], [[0], [0]]);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}

//FUnción para obtener el trafico de clientes
function trafico() {
    //Se detiene la recarga de la página
    event.preventDefault();
    //Se crear una variable donde guardar las fechas
    let datos = new FormData();
    datos.append("fechainicial", document.getElementById("inicioTraficoI").value);
    datos.append("fechafinal", document.getElementById("finTraficoI").value);
    //Se realiza la petición para obtener los datos
    fetch(API_estadistica + "trafico", {
        method: "post",
        body: datos,
    }).then(function (request) {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se pasa a formato JSON
            request.json().then(function (response) {
                //Se revisa el estado devuelto por la api
                if (response.status) {
                    //Se declaran los arreglos donde se guardarán los datos
                    let cabeceras = [],
                        general = [];
                    //Se revisa fila por fila y se guardan los datos
                    response.dataset.map(function (row) {
                        //Se cargan los datos a un fila
                        datos = [];
                        datos.push(
                            row.nombre,
                            row.compras,
                            row.cantidad,
                            "$" + row.promedio,
                            `${row.fecha < moment().subtract(1, "months").format("YYYY-MM-DD")
                                ? "Registrado: " + row.fecha
                                : "Nuevo cliente:  " + row.fecha
                            }`
                        );
                        general.push(datos);
                    });
                    //Se agregan los titulos de las columnas
                    cabeceras.push("Cliente", "Compras", "Cantidad", "Promedio", "Registro");
                    //Se pasan los datos a un array general

                    //Se pasan los datos para generar un reporte
                    reporte_tablas(
                        cabeceras,
                        general,
                        "Reporte, trafico" + moment().format("YYYY-MM-DD"),
                        "Tráfico de cliente"
                    );
                } else {
                    //Se le muestra el error
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Función de ventas semanales
function ventas() {
    //Se detiene la recarga de la página
    event.preventDefault();
    //Se crean los arreglos donde se guardarán los datos
    let titulo = [],
        cabeceras = [],
        datos_tablas = [];

    for (let index = 0; index < document.getElementById("tiempo").value; index++) {
        //Se crear una variable donde guardar las fechas
        let datos = new FormData();
        //Se cargan los datos de las fechas
        datos.append(
            "fechainicial",
            moment()
                .subtract(7 * (index + 1), "days")
                .format("YYYY-MM-DD")
        );
        datos.append(
            "fechafinal",
            moment()
                .subtract(7 * index, "days")
                .format("YYYY-MM-DD")
        );
        //Se realiza la petición para obtener los datos
        fetch(API_estadistica + "ventas", {
            method: "post",
            body: datos,
        }).then(function (request) {
            //Se revisa el estado de la ejecución
            if (request.ok) {
                //Se pasa a formato JSON
                request.json().then(function (response) {
                    //Se crea un variable para datos de una tabla
                    let general = [];
                    //Se crea una variable para el total
                    let total = 0.0;
                    //Se revisa el estado devuelto por la api
                    if (response.status) {
                        //Se revisa fila por fila y se guardan los datos
                        response.dataset.map(function (row) {
                            //Se declaran los arreglos donde se guardarán los datos
                            let columnas = [],
                                filas = [];
                            //Se agregan los titulos de las columnas
                            columnas.push("Producto", "Cantidad", "Precio", "Total por producto");
                            filas.push(
                                row.nombre_producto,
                                row.cantidad,
                                "$" + row.precio_producto_orden,
                                "$" + row.total
                            );
                            cabeceras.push(columnas);
                            general.push(filas);
                            total = total + Number(row.total);
                        });
                        general.push(["", "", "Total", "$" + total.toFixed(2)]);
                        //Se pasan los datos a un array general
                        datos_tablas.push(general);
                        //Se agrega el titulo de la página
                        titulo.push(
                            "Semana " +
                            (index + 1) +
                            " del " +
                            moment()
                                .subtract(7 * (index + 1), "days")
                                .format("YYYY-MM-DD") +
                            " al " +
                            moment()
                                .subtract(7 * index, "days")
                                .format("YYYY-MM-DD")
                        );
                    } else {
                    }
                });
            } else {
                //Se imprime el error en la consola
                console.log(request.status + " " + request.statusText);
            }
        });
    }
    //se revisa si se encontraron datos o no
    if (datos_tablas.length <= 0) {
        titulo.push('No se encontraron resultados');
        datos_tablas.push([''],['']);
    }
    //Se pasan los datos para generar un reporte
    reporte_multitablas(cabeceras, datos_tablas, "Intento de pdf", titulo);
}

//Función para obtener el top de productos
function top_productos() {
    //Se detiene la recarga de la página
    event.preventDefault();
    //Se realiza la petición para obtener los datos
    fetch(API_estadistica + "top", {
        method: "get",
    }).then(function (request) {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se pasa a formato JSON
            request.json().then(function (response) {
                //Se revisa el estado devuelto por la api
                if (response.status) {
                    //Se declaran los arreglos donde se guardarán los datos
                    let cabeceras = [],
                        general = [];
                    //Se revisa fila por fila y se guardan los datos
                    response.dataset.map(function (row) {
                        //Se cargan los datos a un fila
                        datos = [];
                        datos.push(row.nombre_producto, row.cantidad, "$" + row.total);
                        general.push(datos);
                    });
                    //Se agregan los titulos de las columnas
                    cabeceras.push("Producto", "Cantidad", "Total");
                    //Se pasan los datos a un array general

                    //Se pasan los datos para generar un reporte
                    reporte_tablas(
                        cabeceras,
                        general,
                        "Reporte top producto" + moment().format("YYYY-MM-DD"),
                        "Top 10 productos más vendidos"
                    );
                } else {
                    //Se le muestra el error
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}
