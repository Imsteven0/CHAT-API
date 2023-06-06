const express = require("express");
require("dotenv").config();

//Conexcion de moongoose
const mongoose = require("./db/mongoose");

//Routes
const Users = require("./routes/Users");
const Conversation = require("./routes/Conversation");
const Message = require("./routes/Messages");

//creamos una constante que esta llamando a express
const app = express();

//Establecer conexión a la base de datos MongoDB
mongoose.Database();

//recibe y envia datos json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Llamar a las rutas necesarias.
app.use('/Users', Users());
app.use('/Conversation', Conversation());
app.use('/Message', Message());


//para que el servidor se levante en el puerto 8000
app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});