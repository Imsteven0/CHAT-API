const express = require("express");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const ioServer = require("./utils/ioServer");

//Conexcion de moongoose
const mongoose = require("./db/mongoose");

//Routes
const Users = require("./routes/Users");
const Conversation = require("./routes/Conversation");
const Message = require("./routes/Messages");
const Auth = require("./routes/Autentication");

//creamos una constante que esta llamando a express
const app = express();

// Habilitar CORS con las opciones configuradas
app.use(cors());

//Establecer conexión a la base de datos MongoDB
mongoose.Database();

app.use(express.static("public"));

//recibe y envia datos json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Llamar a las rutas necesarias.
app.use("/Users", Users());
app.use("/Conversation", Conversation());
app.use("/Message", Message());
app.use("/Auth", Auth());

// Create an HTTP server using Express app
const server = http.createServer(app);

ioServer.ioServer(server);

// Start the seqrver
server.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en puerto " + process.env.PORT);
});