// Constantes para establecer rutas de archivos esenciales y parametros de la API
const API_catalogo = SERVER + "public/api_catalogo.php?action=";

//Método que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    let busqueda = params.get("id");
    //se verifica si se está enviando algo o no
    if (busqueda != null) {
        //se crea la variable de tipo form
        let dato = new FormData();
        //se llena con el id
        dato.append('busqueda', busqueda);
        //si hay algo que buscar se realiza la consulta
        buscar(API_catalogo, 'buscarProducto', dato);

    } else {
        //se cargan todos los productos
        leerTablas(API_catalogo, 'cargarCatalogo');
    }
});


//Función que llenará los datos en el catálogo
function llenarTabla(dataset) {
    //Se declara la variable donde se guardará los datos
    let contenido = "";
    //Se va agregando las filas de codigo HTML por cada fila de registro obtenido
    //se verifica si está vacío o no
    if (dataset.length == 0) {
        sweetAlert(3, 'No hay coincidencias', null);
        //se cargan todos los productos
        leerTablas(API_catalogo, 'cargarCatalogo');
    } else {
        dataset.map(function (row) {
            contenido += `
             <div class="col s12 m6 l4">
                <div class="card">
                    <div class="card-image">
                        <img src="../../api/images/productos/${row.imagen}" class="imagen-foto">
                        <a class="btn green btn-floating halfway-fab pulse activator">+</a>
                    </div>
                    <div class="divider"></div>
                    <div class="section-1">
                        <span id="cards-title" class="card-title">${row.nombre_producto}</span>
                    </div>
            
                    <div class="card-content">
                        <h6 class="content-2">Precio: $${row.precio}</h6>
                    </div>
                    <div class="card-reveal">
                        <span id="span-title" class="card-title"> ${row.nombre_producto} <i class="right">x</i></span>
                        <hr>
                        <h6 class="content">Descripción:</h6>
                        <p class="content">${row.descripcion}
                        </p>
                    </div>
                    <div class="card-action">
                        <a href="detalle.html?id=${row.id_producto}" id="producto" class="waves-effect waves-light btn green">Mostrar<i
                                    class="fa-solid fa-cart-plus left"></i></a>
                    </div>
                </div>
            </div>`;

        });
        //Se le insertan las filas a la tabla en la vista
        document.getElementById("contenedorProductos").innerHTML = contenido;
    }

}


//función que realiza la busqueda cuando se da enter

document.getElementById('buscador_producto').addEventListener('keyup', function (key) {
    //Se obtiene el código de la tecla
    let tecla = key.keyCode;
    //se revisa si es enter
    if (tecla == 13 || document.getElementById('buscador_producto').value == "") {
        //Se crea la variable de tipo formulario
        let dato = new FormData();
        //Se llena con el texto del input
        dato.append('busqueda', document.getElementById('buscador_producto').value);
        //se busca el producto
        buscar(API_catalogo, 'buscarProducto', dato);
    } else {
        console.log('No se puede');
    }
});


