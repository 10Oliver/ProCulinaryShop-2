/* Activaciones */

document.addEventListener('DOMContentLoaded', function () {
    //Variable del tiempo
    let date = new Date();
    //Activaciones de materialize
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    var elems = document.querySelectorAll('.sidenav');
    let options = {
        onOpenStart: 1,
        format: "yyyy-mm-dd",
        twelveHour: true,
        minDate: date,
        dismissible: true,
    };
    var instances = M.Sidenav.init(elems, options);
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    var elems = document.querySelectorAll(".datepicker");

    var instances = M.Datepicker.init(elems,options);
});