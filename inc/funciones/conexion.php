<?php

$conn = new mysqli('localhost', 'hims', 'Maga_098', 'uptask');

//Haciendo ping a la base de datos la cual nos debe devolver un bool(true)
// echo "<pre>";
// var_dump($conn->ping());
// echo"</pre>"; 

//Nos imprime el error, si existe, de la conexión a la BD
if($conn->connect_error){
    echo $conn->connect_error;
}

//Nos muestra los caracteres especiales
$conn->set_charset('utf8');