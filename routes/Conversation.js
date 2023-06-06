const express = require("express");
const router = express.Router();
const controllerConversation = require("../controller/ControllerConversation");

module.exports = function () {
  router.get("/listConversation", controllerConversation.listConversation);

  router.get("/listConversationById/:userId", controllerConversation.listConversationByUserID);

  router.get("/listChatsUsers/:userId", controllerConversation.listChatsUsers);

  router.post("/newChat", controllerConversation.newChat);




  return router;
};