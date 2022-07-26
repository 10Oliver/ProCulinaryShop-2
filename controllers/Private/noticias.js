// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_noticia = SERVER + "private/api_noticias.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    leertablas(API_noticia, "cargar_datos");
    cargar_select(API_noticia + "cargar_categorias", "selector_categoria", null, 1);

    //Se carga el componente de los sliders
    var dateSlider = document.getElementById("slider-fecha");

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


    //Obtención de los componentes a colocarles las fechas
    var dateValues = [document.getElementById("inicio"), document.getElementById("fin")];
    var valores = [document.getElementById("inicioI"), document.getElementById("finI")];

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
        noticias();
    });

});



//Función que llenará la tabla
function llenar_tabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    //Se recorre el conjunto para determinar fila por fila la cantidad de registros
    dataset.map(function (row) {
        //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
        contenido += `
        <tr>
        <td>${row.imagen}</td>
        <td>${row.nombre_producto}</td>
        <td>${row.titulo_noticia}</td>
        <td>${row.descripcion_noticia}</td>
        <td>${row.descuento}</td>
        <td>
            <a onclick="modal_actualizar(${row.id_noticia})" class="btn editar"><i
                class="material-icons ">create</i></a>
            <a href="#eliminar" onclick="modal_eliminar(${row.id_noticia})" class=" btn eliminar"><i
                class="material-icons ">delete</i></a></td>
        </tr>
        `;
    });

    //Se le insertan las filas a la tabla en la vista
    document.getElementById("cuerpo_noticias").innerHTML = contenido;
}


//Función que llenará los select al agregar noticias

function cargar_modal() {
    //Se cargan los select con los datos correspondientes
    cargar_select(API_noticia + "cargar_productos", "productos_select", null);
    cargar_select(API_noticia + "cargar_tipos", "tipo_noticia", null);

}

//Método que guardará la nueva noticia

document.getElementById("guardar_noticia").addEventListener('submit', function (event) {
    //Se evita que se recargue la página
    event.preventDefault();
    //Se ejecuta la función para guardar, está en components.js
    guardar_registro(API_noticia, "guardar_noticia", "guardar_noticia", "agregar");
});


//Función para precargar los datos para actualizar

function modal_actualizar(identificador) {
    // Se abre el modal correspondiente
    M.Modal.getInstance(document.getElementById("modificar")).open();
    // Se crea datos de tipo formulario para mandarlos
    const identificador_principal = new FormData();
    //Se llena con el name y el valor
    identificador_principal.append("identificador_p", identificador);
    //Se realiza una la petición para cargar los datos en los campos
    fetch(API_noticia + "obtener_actualizar", {
        method: "post",
        body: identificador_principal,
    }).then(function (request) {
        //Se verifica si la sentencia se ejecutó adecuadamente
        if (request.ok) {
            //Se pasa a formato JSOn
            request.json().then(function (response) {
                //Se  verifica el estado de la respuesta
                if (response.status) {
                    //Se cargan los datos con el registro seleccionado
                    document.getElementById("identificadorM").value =
                        response.dataset.id_noticia;
                    console.log(response.dataset.id_noticia);
                    document.getElementById("titulo_noticiaM").value =
                        response.dataset.titulo_noticia;
                    document.getElementById("fecha_finalM").value =
                        response.dataset.fecha_final;
                    document.getElementById("descuentoM").value =
                        response.dataset.descuento;
                    document.getElementById("descripcion_noticiaM").value =
                        response.dataset.descripcion_noticia;
                    // Se actualizan los labels como si estuviera escrito algo manualmente
                    M.updateTextFields();

                    //Se carga el select con la función en components.js
                    cargar_select(
                        API_noticia + "cargar_productos", "productos_selectM",
                        response.dataset.id_producto, null);
                    cargar_select(
                        API_noticia + "cargar_tipos", "tipo_noticiaM",
                        response.dataset.id_tipo_noticia, null);
                    cargar_select(
                        API_noticia + "cargar_estados", "estado_noticiaM",
                        response.dataset.id_estado_noticia, null);
                } else {
                    //Se envía la alerta con la excepción
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            //Se escribe en la consola el error
            console.log(request.status + " " + request.statusText);
        }
    });
}


//Método para actualizar los datos en la noticia

document.getElementById('actualizar_noticia').addEventListener('submit', function (event) {
    //Se evita que se recargue la página
    event.preventDefault();
    //Se ejecuta el método qu actulizará
    actualizar_registro(API_noticia, 'actualizar_noticia', 'actualizar_noticia', 'modificar');
    //Se recarga la tabla de datos
    leertablas(API_noticia, "cargar_datos");
})


//Función que cargará los datos en el modal
function modal_eliminar(identificador) {
    //Se crea una constante de tipo Form para guardar el di
    const identificador_principal = new FormData();
    //Se llena con el name y el valor
    identificador_principal.append("identificador_p", identificador);
    //Se ejecuta la función para reestablecerlo, está en components.js
    eliminar_registro(API_noticia, "eliminar_noticia", identificador_principal, null, "cargar_datos");

}

//Función que buscará los datos
document.getElementById('buscador').addEventListener("keyup", function () {
    //Se obtiene el valor del buscador y del cargo
    let texto = document.getElementById("buscador").value;
    let categoria = document.getElementById("selector_categoria").value;
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valor con ambos datos
    datos.append("buscador", texto);
    datos.append("categoria", categoria);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_noticia, "buscar", datos);
});


//Función que buscará los datos
document.getElementById('selector_categoria').addEventListener("change", function (event) {
    //Se obtiene el valor del buscador y del cargo
    let texto = document.getElementById("buscador").value;
    let categoria = document.getElementById("selector_categoria").value;
    //Se crea un objeto de tipo form para guardar los datos
    var datos = new FormData();
    //Se llena con el name y el valor con ambos datos
    datos.append("buscador", texto);
    datos.append("categoria", categoria);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_noticia, "buscar", datos);
});

//función que cargará los datos en la gráfica
function noticias() {
    //Se crea una variable de tipo form
    let datos = new FormData();
    //Se llena con las fechas
    datos.append("fechainicial", document.getElementById("inicioI").value);
    datos.append("fechafinal", document.getElementById("finI").value);
    //Se realiza la petición a la api
    fetch(API_noticia + "cargarNoticias", {
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
                        general = [];
                    titulos = [];
                    //se guardan los datos por fila
                    response.dataset.map(function (row) {
                        titulos.push(row.nombre_producto);
                        datos.push(row.total);
                    });
                    general.push(datos);
                    //se envían para general la gráfica
                    barras(".barra", titulos, general);
                } else {
                    barras(".barra", ["No hay datos disponibles"], [[0]]);
                }
            });
        } else {
            //Se imprime el error en la consola
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Función para generar un reporte de noticias terminadas
function reporte() {
    //Se detiene la recarga de la página
    event.preventDefault();
    //Se crea la petición para obtener los datos
    fetch(API_noticia + 'reporte', {
        method: 'get',
    }).then(function (request) {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se temrina de pasar a formato JSON
            request.json().then(function (response) {
                //Se revisa el estado devuelto por la api
                if (response.status) {
                    //Se crean las variables donde se guardarán los datos
                    let cabeceras = [], general = [];
                    //Se extraen los datos fila por fila
                    response.dataset.map(function (row) {
                        //Se crea un arreglo con las filas
                        let fila = [];
                        //Se llena de datos
                        fila.push(row.nombre_producto, '$' + row.total, row.fecha_inicial, row.fecha_final);
                        //Se agrega al contenedor de filas
                        general.push(fila);
                    });
                    //Se crean los titulos de las cabeceras
                    cabeceras.push('Nombre del producto', 'Total recaudado', 'Inicio de la noticia', 'Fin de la noticia');
                    //Se envian los datos para generar el reporte
                    reporte_tablas(cabeceras, general, `Reporte de noticias terminadas ${moment().format("YYYY-MM-DD")}`, 'Dinero recaudado por noticias finalizadas')
                } else {
                    //Se muestra el error
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            //Se imprime el error en la consola
            console.log(request.status + ' ' + request.statusText);
        }
    });
}