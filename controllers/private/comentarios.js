//Se crea la constante con parte de la dirección de la api
const API_comentario = SERVER + "private/api_comentarios.php?action=";

//Se crea un método dondese cargaran datos al cargar la pagina

document.addEventListener("DOMContentLoaded", function () {
    //Se cargan los datos en la tabla, la función está en components.js
    leertablas(API_comentario, "cargarDatos");
});

//Función que carga los datos en la tabla
function llenarTabla(dataset) {
    //Se crea la variable donde se guardarán los datos
    let contenido = "";
    //Se explora el vector fila por fila
    dataset.map(function (row) {
        //Se ingresa el HTML a inyectar
        if (row.id_estado_resena == 1) {
            contenido += `
            <tr>
                <td>${row.id_resena}</td>
                <td>${row.nombre_cliente}</td>
                <td>${row.correo_cliente}</td>
                <td>${row.nombre_producto}</td>
                <td>${row.calificacion}/5</td>
                <td>${row.resena}</td>
                <td> 
                    <div class="switch">
                        <label>
                        <input id="comentario${row.id_resena}" type="checkbox" checked="on" onClick="actualizarComentario(${row.id_resena})">
                        <span class="lever"></span>
                        </label>
                    </div>
                </td>
            </tr>`;
        } else {
            contenido += `
            <tr>
                <td>${row.id_resena}</td>
                <td>${row.nombre_cliente}</td>
                <td>${row.correo_cliente}</td>
                <td>${row.nombre_producto}</td>
                <td>${row.calificacion}/5</td>
                <td>${row.resena}</td>
                <td> 
                    <div class="switch">
                        <label>
                        <input id="comentario${row.id_resena}" type="checkbox" onClick="actualizarComentario(${row.id_resena})">
                        <span class="lever"></span>
                        </label>
                    </div>
                </td>
            </tr>`;
        }
    });
    //Se le insertan las filas a la tabla en la vista
    document.getElementById("tabla_cuerpo").innerHTML = contenido;
}


//Función que actualiza el estado del comentario

function actualizarComentario(id) {
    //Se crea el dato de tipo formulario a enviar
    let datos = new FormData();
    //Se llena con el name y el valor del identificador
    datos.append("identificador_p", id);

    if (document.getElementById("comentario" + id).checked) {
        //Se toma como encendido el comentario
        datos.append("valor", 1);
    } else {
        //Se toma como apagado el comentario
        datos.append("valor", 2);
    }
    fetch(API_comentario + "actualizarComentario", {
        method: "post",
        body: datos,
    }).then(function (request) {
        //Se revisa si la petición se ejecutó correctamente
        if (request.ok) {
            //Se convierte la respuesta a un JSON
            request.json().then(function (respose) {
                //Se revisa si se obtuvo una respuesta satisfactoria
                if (!respose.status) {
                    //Si ocurrió algún problema
                    sweetAlert(2, respose.exception, null);
                }
            });
        } else {
            //Se escribe en la consola el error
            console.log(request.status + " " + request.statusText);
        }
    });
}

//Función que buscará los datos
document.getElementById("buscador").addEventListener("keyup", function () {
    //Se obtiene el valor del buscador
    let texto = document.getElementById("buscador").value;
    //Se crea un objeto de tipo form para guardar los datos
    let datos = new FormData();
    //Se llena con el name y el valor
    datos.append("buscador", texto);
    //Se ejecuta el método para buscar, está en components.js
    buscar(API_comentario, "buscar", datos);
});
