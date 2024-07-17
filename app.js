const express = require('express')
const app = express()
const port = 3000
// Get the client
const mysql = require('mysql2/promise');
const cors = require('cors')
const bodyparser = require('body-parser')
const session = require('express-session')

app.use(bodyparser.json());
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials:true
  }
))

app.use(session(
  {
    secret: 'sadffagdgsdfbgfhdhs'
  }
))

// Create the connection to database
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'login',
});

app.get('/registro', async (req, res) => {
  const datos = req.query;
  // A simple SELECT query
try {
const [results, fields] = await connection.query(
  'INSERT INTO `usuarios` (`id`,`email`,`password`) VALUES (NULL,"?","?")',
  [datos.email, datos.password]
);
if(results.affectedRows > 0){
  req.session.email = datos.email;
  return res.status(200).send('registro correcto')
} else {
  return res.status(401).send('no se registro')
}
} catch (err) {
  res.status(500).send('Error interno del servidor');
  console.log(err);
}
  })
app.get('/login', async (req, res) => {
    const datos = req.query;
    // A simple SELECT query
try {
  const [results, f] = await connection.query(
    'SELECT * FROM `usuarios` WHERE `email` = ? AND `password` = ?',
    [datos.email, datos.password]
  );
  console.log('Resultados de la consulta:', results); 
  if(results.length > 0){
    req.session.email = datos.email;
    return res.status(200).send('inicio de sesion correcto')
  } else {
    return res.status(401).send('datos correctos')
  }

  
} catch (err) {
  res.status(500).send('Error interno del servidor');
  console.log(err);
}
  })
app.get('/validar', (req, res) => {
  if(req.session.email){
    res.status(200).send('sesion validada')
  } else{
    res.status(401).send('no autorisado')
  }
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})