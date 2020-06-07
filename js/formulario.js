eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();
    // console.log('Aquí vamos!!');

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    // console.log(usuario + ' ' + password);

    if (usuario === '' || password === '') {
        // alert("Los dos campos son obligatorios!!");
        // La validación falló
        Swal.fire({
            icon: 'error',
            title: 'Oh oh...',
            text: 'Los dos campos son obligatorios!'
        });
    } else {

        // Ambos campos son correctos, mandar ejecutar Ajax

        //Datos que se envían al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        //Vemos el FormData de usuario
        // console.log(datos.get('usuario')); 

        //Crear el llamado a Ajax
        var xhr = new XMLHttpRequest();

        //Abrir la conexión
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);



        //Retorno de datos
        xhr.onload = function() {
            if (this.status === 200) {

                var respuesta = JSON.parse(xhr.responseText);

                console.log(respuesta);

                //Si la respuesta es correcta
                if (respuesta.respuesta === 'correcto') {
                    //Si es un nuevo usuario
                    if (respuesta.tipo === 'crear') {

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
                            title: 'Usuario creado correctamente'
                        });

                    } else if (respuesta.tipo === 'login') {

                        Swal.fire({
                                icon: 'success',
                                title: 'Login correcto!',
                                text: 'Presiona Ok para ir al Dashboard'
                            })
                            .then(resultado => {
                                if (resultado.value) {
                                    window.location.href = 'index.php';
                                }

                            });

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
                        title: 'Algo salió mal!!'
                    });
                }

            }
        }

        //Enviar la petición
        xhr.send(datos);

    }


}