const express = require("express");
const router = express.Router();
const controllerUsers = require("../controller/ControllerUsers");

module.exports = function () {
  router.get("/listUsers", controllerUsers.listUsers);

  router.post("/newUser", controllerUsers.saveUser);

  return router;
};
