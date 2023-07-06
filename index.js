const express = require("express");
require("dotenv").config();
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");

//Conexcion de moongoose
const mongoose = require("./db/mongoose");

//Routes
const Users = require("./routes/Users");
const Conversation = require("./routes/Conversation");
const Message = require("./routes/Messages");
const Auth = require("./routes/Autentication");

//creamos una constante que esta llamando a express
const app = express();

const corsOptions = {
    origin: "http://localhost:3000", // Reemplaza con el origen correcto de tu cliente
    methods: ["GET", "POST"], // Especifica los métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Especifica los encabezados permitidos
};

// Habilitar CORS con las opciones configuradas
app.use(cors(corsOptions));

//Establecer conexión a la base de datos MongoDB
mongoose.Database();

app.use(express.static("public"));

//recibe y envia datos json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Llamar a las rutas necesarias.
app.use("/Users", Users());
app.use("/Conversation", Conversation());
app.use("/Message", Message());
app.use("/Auth", Auth());

// Create an HTTP server using Express app
const server = http.createServer(app);

// Create a WebSocket server instance
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Reemplaza con el origen correcto de tu cliente
        methods: ["GET", "POST"], // Especifica los métodos HTTP permitidos
        allowedHeaders: ["Content-Type", "Authorization"], // Especifica los encabezados permitidos
    },
});

// Event handler for new socket connections
io.on("connection", (socket) => {
    // Event handler for 'disconnect' event

    socket.on("disconnect", () => {
    });

    socket.on("newMessage", (data) => {
        io.emit("messageReceived", data);
    });
});

// Start the server
server.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en puerto " + process.env.PORT);
});
