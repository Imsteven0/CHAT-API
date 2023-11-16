const { Server } = require("socket.io");
const { getConversations } = require("../controller/ControllerConversation");
const { saveNewMessage } = require("../controller/ControllerMessages");

exports.ioServer = (server) => {
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

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });

        socket.on("newMessage", async (data) => {
            let saveMessage = await saveNewMessage(data);
            io.emit("messageReceived", saveMessage);
        });

        socket.on("userConnect", async (datos) => {
            console.log(datos.idUser);
            let data = await getConversations(datos.idUser);
            io.emit("userChats", data);
        });

    });
};