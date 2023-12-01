const TABLA = 'auth';
module.exports = function(dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../database/db');
    }            
    
    function agregar_auth(data){

        const authData = {
            id: data.id,
        }

        if(data.usuario){
            authData.usuario = data.usuario;
        }
        if(data.password){
            authData.password = data.password
        }
        return db.agregar_auth(TABLA,authData);
    }

    return{                
        agregar_auth
    }    
}