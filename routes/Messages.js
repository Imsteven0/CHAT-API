const express = require("express");
const router = express.Router();
const controllerMessages = require("../controller/ControllerMessages");

module.exports = function () {
  router.get("/listMessagesByIdConversation/:IdConversation", controllerMessages.listMessagesByIdConversation);

  router.post("/newMessage", controllerMessages.newMessage);

  return router;
};
