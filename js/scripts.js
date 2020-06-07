eventListeners();
//Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    //Document Ready
    document.addEventListener('DOMContentLoaded', function() {
        actualizarProgreso();
    });

    //botón para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //Botón para agregar tareas
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //Botones para las acciones de la tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

    //Borrar proyecto
    // document.querySelector('ul#proyectos').addEventListener('click', accionesSidebar);
}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log('Presionaste en nuevo proyecto');

    //Crear un <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // Seleccionar el id con el nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // Al presionar enter crear el proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        // console.log(e);

        var tecla = e.which || e.KeyCode;
        if (tecla === 13) {
            guardarProyetoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);

        }
    });
}

function guardarProyetoDB(nombreProyecto) {
    // 1. Crear llamado de ajax
    var xhr = new XMLHttpRequest();
    //Enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    //2. Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-proyectos.php', true);
    //3. En la carga
    xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                var proyecto = respuesta.nombre_proyecto,
                    id_proyecto = respuesta.id_insertado,
                    tipo = respuesta.tipo,
                    resultado = respuesta.respuesta;
                // Comprobar la inserción
                if (resultado === 'correcto') {
                    // respuesta exitosa
                    if (tipo === 'crear') {
                        //Se creó un nuevo proyecto
                        // Inyectar HTML
                        var nuevoProyecto = document.createElement('li');
                        nuevoProyecto.innerHTML = `<a href="index.php?id_proyecto=${id_proyecto}" id="proyecto: ${id_proyecto}">
                                                ${proyecto}
                                                </a>`;
                        listaProyectos.appendChild(nuevoProyecto);
                        // Enviar alerta exitosa
                        Swal.fire({
                                icon: 'success',
                                title: 'El proyecto: ' + proyecto + ' fue agregado correctamente',
                                text: 'Presiona Ok para agregar las tareas'
                            })
                            .then(resultado => {
                                // Redireccionar a la nueva URL
                                if (resultado.value) {
                                    window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                                }
                            });
                    } else {
                        //Se actualizó o se elimninó
                    }
                } else {
                    // Hubo un error
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        onOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });
                    Toast.fire({
                        icon: 'error',
                        title: 'Hubo un error!!'
                    });
                }
            }
        }
        //4. Enviar el request
    xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    // Validar que el campo contenga algo
    if (nombreTarea === '') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
        Toast.fire({
            icon: 'error',
            title: 'Una tarea no puede ir vacía'
        });

    } else {
        //El campo de tarea contiene algo insertar en PHP
        //1. Crear llamado a Ajax
        var xhr = new XMLHttpRequest();
        //2. Crear formData
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);
        //3. Abrir la conexión
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
        //4. Ejecutarlo y respuesta
        xhr.onload = function() {
                if (this.status === 200) {
                    var respuesta = JSON.parse(xhr.responseText);
                    // console.log(respuesta);
                    // Asignar valores
                    var resultado = respuesta.respuesta,
                        tarea = respuesta.tarea,
                        id_insertado = respuesta.id_insertado,
                        tipo = respuesta.tipo;
                    if (resultado === 'correcto') {
                        //Se agregó correctamente
                        if (tipo === 'crear') {
                            //Lanzamos alerta
                            const Toast = Swal.mixin({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                onOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            });
                            Toast.fire({
                                icon: 'success',
                                title: 'La tarea fue creada correctamente'
                            });

                            //Seleccionar el párrafo de aviso de lista vacía
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                document.querySelector('.lista-vacia').remove();
                            }


                            //Construir el template
                            var nuevaTarea = document.createElement('li');
                            //Agregamos el Id
                            nuevaTarea.id = 'tarea:' + id_insertado;
                            //Agregar la clase tarea
                            nuevaTarea.classList.add('tarea');
                            //Construir el HTML
                            nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                            `;
                            //Agregarlo al DOM
                            var listado = document.querySelector('.listado-pendientes ul');
                            listado.appendChild(nuevaTarea);
                            //Limpiar el formulario
                            document.querySelector('.agregar-tarea').reset();
                            //Borrar de la BD
                            eliminarTareaBD(tareaEliminada);

                        }

                    } else {
                        //Hubo un error
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            onOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        });

                        Toast.fire({
                            icon: 'error',
                            title: 'Hubo un error!'
                        });
                    }

                }
            }
            //5. Enviar la consulta
        xhr.send(datos);
    }

}

//Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();
    // console.log(e.target);
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    if (e.target.classList.contains('fa-trash')) {
        // console.log('hiciste click en el bote');
        Swal.fire({
            title: 'Seguro(a)?',
            text: "esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                var tareaEliminada = e.target.parentElement.parentElement;
                //Borrar de la BD
                eliminarTareaBD(tareaEliminada);

                //Borrar de HTML
                // console.log(tareaEliminada);
                tareaEliminada.remove();


                Swal.fire(
                    'Eliminada!',
                    'La tarea ha sido eliminada',
                    'success'
                )
            }
        })
    }
}

// cambia el estado de las tareas completo <=> incompleto
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    // console.log(idTarea[1]);
    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();
    //Crear formData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    //Ejecutarlo y respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                console.log(JSON.parse(xhr.responseText));
                //Actualizar el progreso en la barra
                actualizarProgreso();
            }
        }
        //5. Enviar la consulta
    xhr.send(datos);
}

// Elimina las tareas de la BD
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');
    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();
    //Crear formData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');
    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);
    //Ejecutarlo y respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                console.log(JSON.parse(xhr.responseText));


                //Comprobar que haya tareas restantes
                var listaTareasRestantes = document.querySelectorAll('li.tarea');
                if (listaTareasRestantes.length === 0) {
                    document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>Aún no hay tareas asignadas a este proyecto</p>";
                }
                //Actualizar el progreso en la barra
                actualizarProgreso();

            }
        }
        //5. Enviar la consulta
    xhr.send(datos);
}

// Actualizar el avanze del proyecto
function actualizarProgreso() {
    //Obtener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    //Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //Determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    console.log(avance);

    //Asignar el avance a la barra
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%';

    //Enviar alerta al terminar el proyecto
    if (avance === 100) {
        Swal.fire({
            icon: 'success',
            title: 'Proyecto terminado',
            text: 'Felicidades!!! ya no tienes tareas pendientes'
        });
    }


}