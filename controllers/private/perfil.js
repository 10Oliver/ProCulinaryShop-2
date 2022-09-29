//Se crea la constante de la API
const API_PERFIL = SERVER + 'private/api_perfil.php?action=';

//Se crea la función que cargará los datos iniciales
document.addEventListener('DOMContentLoaded', function () {
    //Se realiza la petición para cargar los datos del perfil
    leerTablas(API_PERFIL, 'leerPerfil');
});

//Función para cargará los datos en el documento
function llenarTabla(dataset) { 
    //Se colocan los datos en los componentes
    document.getElementById('nombre').value = dataset.nombre_empleado;
    document.getElementById('apellido').value = dataset.apellido_empleado;
    document.getElementById('telefono').value = dataset.telefono_empleado;
    document.getElementById('correo').value = dataset.correo_empleado;
    document.getElementById('direccion').value = dataset.direccion_empleado;
    document.getElementById('usuario').value = dataset.usuario_empleado;
    document.getElementById('cargo').value = dataset.nombre_cargo;
    document.getElementById('fecha').value = '2020-03-03';
    document.getElementById('estado-factor').innerHTML = dataset.factor == null ? 'Desactivado' : '¡Activado!'; 
    //Se revisa si el factor está activado
    if (dataset.factor == null) {
        document.getElementById('opcionesFactor').innerHTML = '<a class="btn" onclick="activar()">¡Activar!</a>';
    } else { 
        document.getElementById('opcionesFactor').innerHTML = ' <a class="btn" onclick="desactivar()">Desactivar</a>';
    }
    //Se activan todos los inputs
    const labels = document.querySelectorAll('.activado');
    labels.forEach(element => {
        element.style = 'transform: translateY(-14px) scale(0.8) !important;';
    });
}

//Función que cambiará los botones de datos personales
function cambiarOpcionesDatos() { 
    //Se crea el componente
    const componente = document.getElementById('opciones_perfil');
    const inputs = document.querySelectorAll('.personal');
    if (componente.innerHTML != '<a class="btn" onclick="cambiarOpcionesDatos()">Modificar</a>') {
        componente.innerHTML = '<a class="btn" onclick="cambiarOpcionesDatos()">Modificar</a>';
        inputs.forEach(element => {
            element.disabled = true;
        });
    } else { 
       
        inputs.forEach(element => {
            element.disabled = false;
        });
        componente.innerHTML = '<div class="col l6 m6 s6 right-align"><a class="btn" onclick="cambiarOpcionesDatos()">Cancelar</a></div><div class="col l6 m6 s6 left-align"> <button type="submit" class="btn">Guardar</buttom></div>';
    }
   
}

//Función que actualizará los datos del perfil
document.getElementById('datosPersonales').addEventListener('submit', (event) => {
    //Se previene la recarga de la página
    event.preventDefault();
    //Se realiza la acción para guardarlo
    fetch(API_PERFIL + 'actualizarDatosPerfil', {
        method: 'post',
        body: new FormData(document.getElementById('datosPersonales')),
    }).then((request) => { 
        //Se revisa el estado de la respuesta
        if (request.ok) {
            //Se pasa a JSON
            request.json().then((response) => { 
                //Se revisa el estado devuelto por la API
                if (response.status) {
                    sweetAlert(1, response.message, null);
                    //Se recarga la página
                    leerTablas(API_PERFIL, 'leerPerfil');
                    //Se desactivan lso datos
                    const inputs = document.querySelectorAll('.personal');
                    inputs.forEach(element => {
                        element.disabled = true;
                    });
                    cambiarOpcionesDatos();
                } else { 
                    //Se muestra el error
                    sweetAlert(2, response.exception, null);
                }
            })
        } else { 
            //Se muestra el problema en la consulta
            console.log(request.status + ' ' + request.statusText);
        }
    })
});


//Función para activar el segundo paso de autentificación
function activar() { 

}

//Función para desactivar el segundo paso de autentificación
function desactivar() { 

}