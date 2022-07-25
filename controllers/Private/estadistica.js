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
    var dateValuesDinero = [
        document.getElementById("inicioDinero"),
        document.getElementById("finDinero"),
    ];
    var valoresDinero = [document.getElementById("inicioDineroI"), document.getElementById("finDineroI")];

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
                    semiPastel(".pastel", ['No se encontraron productos'], [100]);
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
        method: 'post',
        body: datos,
    }).then(function (request) { 
        //Se revisa el estado de la ejecución
        if (request.ok) { 
            //Se convierte a json
            request.json().then(function (response) { 
                //Se revisa el estado devuelto por la api
                if (response.status) {
                    //se crean las variables que almacerán los datos para la gráfica
                    let datos = [],promedio = [], total = []
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
            })
        } else { 
            //Se imprime el error en la consola
            console.log(request.status + ' ' + request.statusText);
        }
    });
}


//Función para generar el reporte del top productos
function top() {
    
}