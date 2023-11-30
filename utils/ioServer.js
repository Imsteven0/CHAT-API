const {Server} = require("socket.io");
const {getConversations, createNewChat} = require("../controller/ControllerConversation");
const {saveNewMessage} = require("../controller/ControllerMessages");
const {listUsersByName} = require("../controller/ControllerUsers");

exports.ioServer = (server) => {
    // Create a WebSocket server instance
    const io = new Server(server, {
        cors: {
            origin: "*", // Reemplaza con el origen correcto de tu cliente
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

        socket.on("searchUser", async (email) => {
            let data = await listUsersByName(email);
            io.emit("getUsers", data);
        });

        socket.on("addFriend", async (dataUser) => {
            console.log('este es ' + dataUser.idOriginUser);
            await createNewChat(dataUser);
            let data = await getConversations(dataUser.idOriginUser);
            console.log(data);
            io.emit("userChats", data);
        });

    });
};