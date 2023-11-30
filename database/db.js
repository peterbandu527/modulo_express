const { Client } = require('pg');

const client = new Client({
  user: 'odoo',
  host: 'localhost',
  database: 'prueba_datos',
  password: 'odoo',
  port: 5434,
});

client.connect();

function todos(tabla){
  return new Promise((resolve, reject)=>{
    client.query(`SELECT * From ${tabla}`,(error,result)=>{
      return error ? reject(error) : resolve(result);
    });
    
  });  
}
function uno(tabla, id){
  return new Promise((resolve, reject)=>{
    client.query(`SELECT * From ${tabla} WHERE id=${id}`,(error,result)=>{
      return error ? reject(error) : resolve(result);
    });
    
  });  
}
function agregar(tabla,data){
  if(data){
    return insertar(tabla, data);
  }else{
    return actualizar(tabla, data);
  }
}

function eliminar(tabla,data){
  return new Promise((resolve, reject)=>{
    client.query(`DELETE From ${tabla} WHERE id=${data.id}`,(error,result)=>{
      return error ? reject(error) : resolve(result);
    });
    
  });  
}

function insertar(tabla,data){
  console.log(data.id+'/'+data.nombre+'/'+data.contrasena+'/'+data.rol);
  return new Promise((resolve, reject)=>{
    client.query(`INSERT INTO ${tabla} (id, nombre, contrasena, rol) VALUES ($1, $2, $3, $4)`, [data.id, data.nombre, data.contrasena, data.rol],(error,result)=>{
      return error ? reject(error) : resolve(result);
    });
    
  });  
}

function actualizar(tabla,data){
  return new Promise((resolve, reject)=>{
    client.query(`UPDATE ${tabla} SET ${data} WHERE id = ${data.id}`,(error,result)=>{
      return error ? reject(error) : resolve(result);
    });
    
  });  
}

// module.exports = client;

module.exports = {
  todos,
  uno,
  agregar,  
  eliminar,
}; 