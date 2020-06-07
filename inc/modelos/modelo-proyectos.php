<?php

//Revisar que esta funcionando la conexión:
// echo json_encode($_POST);

//Leemos los datos
$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

// echo json_encode($_POST);

if($accion === 'crear'){
    
    //Importar la conexión
    include '../funciones/conexion.php';

    try{
        //Realizar la cosulta a la base de datos
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES(?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute(); 
        if($stmt->affected_rows > 0){
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' =>  $accion,
                'nombre_proyecto' => $proyecto
            );
        } else{
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();

    } catch(Exeption $e){
        //En caso de un error, tomar la exepción
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}
