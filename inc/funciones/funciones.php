<?php

// Obtiene la página actual que se ejecuta 
function pagActual(){
    $archivo = basename($_SERVER['PHP_SELF']); //Nos devuelve el archivo actual
    $pagina = str_replace(".php", "", $archivo);
    return $pagina; //return para que este valor lo podamos utilizar
}
pagActual();

// Consultas
//Obtener todos los proyectos
function obtenerProyectos(){
    include 'conexion.php';
    try{
    
    return $conn->query('SELECT id, nombre FROM proyectos');
    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

// Obtenerel nombre del proyecto
function obtenerNombreProyecto($id=null){
    include 'conexion.php';
    try{
        return $conn->query("SELECT nombre FROM proyectos WHERE id={$id}");
    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}

// Obtener las clases del proyecto

function obtenerTareasProyecto($id=null){
    include 'conexion.php';
    try{
        return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto={$id}");
    }catch(Exception $e){
        echo "Error! : " . $e->getMessage();
        return false;
    }
}