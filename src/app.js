require('dotenv').config()
const express = require ('express')
const path = require('path');
const cors = require('cors')
const { dbConnect } = require('./config/mysql')

const PORT = process.env.PORT
const app = express()

app.use(cors());
app.use(express.json());

app.use('/api', require('./routers'))

app.use(express.static(path.join(__dirname, 'views','build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','build','index.html'));
  });

dbConnect()
app.listen(PORT,()=>{
    console.log('Api Iniciada en el puerto',PORT)
})