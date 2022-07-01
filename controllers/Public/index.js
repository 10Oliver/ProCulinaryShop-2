// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_index = SERVER + "public/api_index.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    leertablas(API_index, "cargarNoticias");
});

//Función que llenará la tabla
function llenar_tabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    //Se recorre el conjunto para determinar fila por fila la cantidad de registros
    dataset.map(function (row) {
        if (row.id_tipo_noticia == 1) {
            //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
            contenido += `
        <div class="col s12 m6 l4">
                    <div class="card">
                        <div class="card-image">
                             <img src="../../api/images/productos/${row.imagen}" class="foto">
                            <a class="btn green btn-floating halfway-fab pulse activator">+</a>
                        </div>
                        <div class="divider"></div>
                        <div class="section-1">
                            <span id="cards-title" class="card-title">${row.titulo_noticia}</span>
                        </div>

                        <div class="card-content">
                            <h6 class="content-2">Precio: $${row.descuento}</h6>
                        </div>
                        <div class="card-reveal">
                            <span id="span-title" class="card-title"> ${row.titulo_noticia} <i class="right">x</i></span>
                            <hr>
                            <h6>Descripción:</h6>
                            <p >${row.descripcion_noticia}</p>
                        </div>
                        <div class="card-action center-align">
                            <a href="detalle.html?id=${row.id_producto}" id="producto" class="waves-effect waves-light btn green">Mostrar<i
                                    class="fa-solid fa-cart-plus left"></i></a>

                        </div>
                    </div>
                </div>
        `;

            //Se le insertan las filas a la tabla en la vista
            document.getElementById("contenedorPromociones").innerHTML = contenido;
        } else if (row.id_tipo_noticia == 2) {
            //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
            contenido += `
        <div class="col s12 m6 l4">
                    <div class="card">
                        <div class="card-image">
                             <img src="../../api/images/productos/${row.imagen}" class="foto">
                            <a class="btn green btn-floating halfway-fab pulse activator">+</a>
                        </div>
                        <div class="divider"></div>
                        <div class="section-1">
                            <span id="cards-title" class="card-title">${row.titulo_noticia}</span>
                        </div>

                        <div class="card-content">
                            <h6 class="content-2">Precio: $${row.descuento}</h6>
                        </div>
                        <div class="card-reveal">
                            <span id="span-title" class="card-title"> ${row.titulo_noticia} <i class="right">x</i></span>
                            <hr>
                             <h6>Descripción:</h6>
                            <p >${row.descripcion_noticia}</p>
                        </div>
                        <div class="card-action center-align">
                           <a href="detalle.html?id=${row.id_producto}" id="producto" class="waves-effect waves-light btn green">Mostrar<i
                                    class="fa-solid fa-cart-plus left"></i></a>

                        </div>
                    </div>
                </div>
        `;

            //Se le insertan las filas a la tabla en la vista
            document.getElementById("contenedorLanzamientos").innerHTML = contenido;
        } else {
            //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
            contenido += `
        <div class="col s12 m6 l4">
                    <div class="card">
                        <div class="card-image">
                             <img src="../../api/images/productos/${row.imagen}" class="foto">
                            <a class="btn green btn-floating halfway-fab pulse activator">+</a>
                        </div>
                        <div class="divider"></div>
                        <div class="section-1">
                            <span id="cards-title" class="card-title">${row.titulo_noticia}</span>
                        </div>

                        <div class="card-content">
                            <h6 class="content-2">Precio: $${row.descuento}</h6>
                        </div>
                        <div class="card-reveal">
                            <span id="span-title" class="card-title"> ${row.titulo_noticia} <i class="right">x</i></span>
                            <hr>
                            <h6>Descripción:</h6>
                            <p >${row.descripcion_noticia}</p>
                        </div>
                        <div class="card-action center-align">
                           <a href="detalle.html?id=${row.id_producto}" id="producto" class="waves-effect waves-light btn green">Mostrar<i
                                    class="fa-solid fa-cart-plus left"></i></a>

                        </div>
                    </div>
                </div>
        `;

            //Se le insertan las filas a la tabla en la vista
            document.getElementById("contenedorVendidos").innerHTML = contenido;
        }
        
    });
}


