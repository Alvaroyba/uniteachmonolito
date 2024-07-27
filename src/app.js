require('dotenv').config()
const express = require ('express')
const path = require('path');
const cors = require('cors')
const mysql = require('mysql2');

const PORT = process.env.PORT
const app = express()

const dbConnect = () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectTimeout: 60000,
        port: process.env.DB_PORT
    });

    connection.connect((err) => {
        if (err) {
            console.error('***** ERROR DE CONEXION A DB*****:', err);
        } else {
            console.log('**** CONEXION A DB CORRECTA ****');
        }
    });
    
    return connection;
}


app.use(cors());
app.use(express.json());

app.use('/api', require('./routers'))

app.use(express.static(path.join(__dirname, 'views','build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','build','index.html'));
  });

dbConnect();

app.listen(PORT,()=>{
    console.log('Api Iniciada en el puerto',PORT)
})
