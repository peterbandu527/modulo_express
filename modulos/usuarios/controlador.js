const TABLA = 'usuarios';
module.exports = function(dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../database/db');
    }

    function todos(){
        return db.todos(TABLA);
    }
    
    function uno(id){
        return db.uno(TABLA,id);
    }
    
    function eliminar(body){
        return db.eliminar(TABLA,body);
    }
    
    function agregar(body){
        return db.agregar(TABLA,body);
    }

    return{
        todos,
        uno,
        eliminar,
        agregar,
    }    
}