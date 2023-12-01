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
  if(data && data.id_user == 0){    
    return insertar(tabla, data);
  }else{
    return actualizar(tabla, data);
  }
}

function eliminar(tabla,data){
  return new Promise((resolve, reject)=>{
    client.query(`DELETE From ${tabla} WHERE id_user=${data.id_user}`,(error,result)=>{
      return error ? reject(error) : resolve(result);
    });
    
  });  
}

function insertar(tabla,data){  
  return new Promise((resolve, reject)=>{
    const query = `INSERT INTO ${tabla} (nombre, rol, activo) VALUES ($1, $2, $3)`;    
    const values = [data.nombre, data.rol, data.activo];
    client.query(query,values, (error,result)=>{ 
      return error ? reject(error) : resolve(result);
    });
    
  });  
}

function actualizar(tabla, data) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE ${tabla} SET nombre = $1, rol = $2, activo = $3 WHERE id = $4`;
    const values = [data.nombre, data.rol, data.activo, data.id_user];

    client.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function agregar_auth(tabla,data){  
  return new Promise((resolve, reject)=>{
    const query = `INSERT INTO ${tabla} (nombre, rol, usuario, activo) VALUES ($1, $2, $3, $4)`;    
    const values = [data.nombre, data.rol, data.usuario, data.activo];
    client.query(query,values, (error,result)=>{ 
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
  agregar_auth,
}; 