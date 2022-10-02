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
    document.getElementById('fecha').value = dataset.fecha_nacimiento;
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
                    //Se desactivan los datos
                    const inputs = document.querySelectorAll('.personal');
                    inputs.forEach(element => {
                        element.disabled = true;
                    });
                    //Se oculta y muestran las opciones adecuadas
                    cambiarOpcionesDatos();
                    //Se resetea el formulario
                    document.getElementById('datosPersonales').reset();
                } else {
                    //Se muestra el error
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            //Se muestra el problema en la consulta
            console.log(request.status + ' ' + request.statusText);
        }
    });
});


//Función para verificar la contraseña antes de cambiar la contraseña
function verificarPassCuenta() {
    //Se crea la variable de tipo form para guardar los datos
    let datos = new FormData();
    datos.append('pass', document.getElementById('passP').value);
    //Se realiza la petición
    fetch(API_PERFIL + 'verificarPass', {
        method: 'post',
        body: datos,
    }).then((request) => {
        //Se revisa la respuesta de la ejecución
        if (request.ok) {
            //Se pasa a json
            request.json().then((response) => {
                //Se revisa el estado devuelto por la API
                if (response.status) {
                    //Se cierra el modal actual
                    M.Modal.getInstance(document.getElementById('permiso')).close();
                    //Se reinicia el input
                    document.getElementById('passP').value = '';
                    //Se trata de carga el usuario
                    cargarUsuario();
                } else {
                    //Se notifica el error
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Función para cargar el usuario en el modal
function cargarUsuario() {
    fetch(API_PERFIL + 'NombreUsuario', {
        method: 'get',
    }).then((request) => {
        //Se verifica el estado de la ejecución
        if (request.ok) {
            //Se pasa a json
            request.json().then((response) => {
                //Se verifica el estado
                if (response.status) {
                    //Se extiende el input
                    document.getElementById('labelUsuario').style = 'transform: translateY(-14px) scale(0.8) !important;';
                    document.getElementById('nombreUsuario').value = response.dataset.usuario_empleado;
                    //Se abre el modal
                    M.Modal.getInstance(document.getElementById('cuenta')).open();
                } else {
                    //No se abre nada y se muestra el problema
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    })
}

//Método para cambiar los datos de la cuenta
document.getElementById('formCuenta').addEventListener('submit', (event) => {
    //Se previene el refrescado automático
    event.preventDefault();
    //Se obtienen ambos componentes de contraseña
    const pass1 = document.getElementById('passN');
    const pass2 = document.getElementById('passC');
    //Se revisa si se colocó la contraseña
    //Se verifica que ambas contraseñas sean iguales
    if (pass1.value.length == 0 && !(pass1.value == pass2.value)) {
        sweetAlert(3, 'Las contraseñas no coinciden', null);
    } else {
        //Se realiza la petición
        guardarRegistro(API_PERFIL, 'actualizarRegistro', 'formCuenta', 'cuenta');
        //Se reinicia el formulario
        document.getElementById('formCuenta').reset();
    }
})

//Función para activar el segundo paso de autentificación
function activar() {
    //Se abre el formulario de verificación de identidad
    M.Modal.getInstance(document.getElementById('activar')).open();
}

//Función para validar que la contraseña sea correcta
function validar() {
    //Se crea la variable para guardar los datos
    let datos = new FormData();
    datos.append('pass', document.getElementById('passA').value);
    //Se realiza la petición
    fetch(API_PERFIL + 'verificarPass', {
        method: 'post',
        body: datos,
    }).then((request) => {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se pasa a json
            request.json().then((response) => {
                //Se revisa el estado devuelto por la API
                if (response.status) {
                    //Se busca la generación del código QR
                    generarCodigo();
                    //Se reinicia el input
                    document.getElementById('passA').value = '';
                    //Se cierra el modal actual
                    M.Modal.getInstance(document.getElementById("activar")).close();

                } else {
                    //Se muestra el problema
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            //Se muestra el problema
            console.log(request.status + ' ' + request.statusText);
        }
    });

}

//Función para generar el código de segundo paso de autentificación
function generarCodigo() {
    //Se realiza la petición
    fetch(API_PERFIL + 'solicitarAutentificacion', {
        method: 'get',
    }).then((request) => {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se pasa a json
            request.json().then((response) => {
                //Se revisa el estado devuelto por la API
                if (response.status) {
                    //Se muestra el éxito
                    sweetAlert(1, response.message, null);
                    //Se cargan los datos en el formulario
                    document.getElementById('imagenQR').src = response.dataset[1]; //QR
                    document.getElementById('codigoTexto').innerHTML = response.dataset[0]; //Código por escrito
                    //Se abre el formulario
                    M.Modal.getInstance(document.getElementById('autentificacion')).open();

                } else {
                    //Se muestra el problema
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            //Se muestra el problema
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Función para validar el código para activar el segundo factor de autentificación
function validarFactor() { 
    //Se crea una variable donde se guardarán los datos
    let datos = new FormData();
    datos.append('codigo', document.getElementById('codigo').value);
    //Se procede a realizar la petición para activarla
    fetch(API_PERFIL + 'activarFactor', {
        method: 'post',
        body: datos,
    }).then((request) => {
        //Se revisa el estado de la ejecución
        if (request.ok) {
            //Se termina de pasar a JSON
            request.json().then((response) => {
                //Se revisa el estado devuelto por la API
                if (response.status) {
                    //Se refrescan los datos
                    leerTablas(API_PERFIL, "leerPerfil");
                    //Se confirma la situación
                    sweetAlert(1, response.message, null);
                    //Se cierra el modal
                    M.Modal.getInstance(document.getElementById("autentificacion")).close();
                    //Se limpia el campo
                    document.getElementById("codigo").value = "";
                } else {
                    //Se muestra el problema
                    sweetAlert(2, response.exception, null);
                }
            });
        } else { 
            //Se imprime el error
            console.log(request.status + ' ' + request.statusText);
        }
    });
}


//Función para desactivar el segundo paso de autentificación
function desactivar() {

}

//Función para limpiar el campo de contraseña
function limpiarPass(id) {
    document.getElementById(id).value = '';
}

//Función para limpiar el formulario
function limpiarForm(id) {
    document.getElementById(id).reset();
}