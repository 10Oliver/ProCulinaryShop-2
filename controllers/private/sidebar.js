/*Activación de elementos del dashboard empleado del sidebar */

/*llamando a los id y a las clases bx-search clase de tipo: icono , #btn id , -sidebar 
etiqueta de clase del panel de navegación lateral*/

//var btn = document.querySelector("#btn");
var sidebar = document.querySelector(".sidebar");

document.getElementById("btn").addEventListener("click", function () {
    sidebar.classList.toggle("open");
    menuBtnChange();
});

/*modificando al abrir icono menu */

function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        btn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
        btn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
}

/*Código para activar abrir los ajustes */
const settings = document.querySelector(".settings");

settings.addEventListener('click', () => {
    location.href = 'perfil.html';
})


/* codigo para el modo nocturno y modo luz */
const body = document.querySelector("body"),
    div = document.querySelector(".nav"),
    modeToggle = document.querySelector(".dark-light");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
    body.classList.add("dark");
}

modeToggle.addEventListener("click", () => {
    modeToggle.classList.toggle("active");
    body.classList.toggle("dark");
    if (!body.classList.contains("dark")) {
        localStorage.setItem("mode", "light-mode");
    } else {
        localStorage.setItem("mode", "dark-mode");
    }
});

setInterval(() => {
    let date = new Date(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds(),
        diaSemana = date.getDay(),
        day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear();

    let d;
    d =
        hour < 12
            ? "AM"
            : "PM"; /*usamos la condición de si hora es menor a 12 entonces la comprobacion devolvera AM */
    hour = hour > 12 ? hour - 12 : hour;
    hour = hour == 0 ? (hour = 12) : hour;

    /*comments */

    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    /*llamando a las clases correspondientes min , hour and second called the classes */

    document.querySelector(".hour_num").innerHTML = hour;
    document.querySelector(".min_num").innerHTML = min;
    document.querySelector(".sec_num").innerHTML = sec;
    document.querySelector(".am_pm").innerHTML = d;

    var pDia = document.getElementById("dia");
    var pDiasemana = document.getElementById("date");
    var pMes = document.getElementById("month");
    var pYear = document.getElementById("year");

    var semana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

    pDia.textContent = semana[diaSemana];

    pDiasemana.textContent = day;

    var meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    pMes.textContent = meses[month];

    pYear.textContent = year;
});
