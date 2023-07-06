const express = require("express");
const router = express.Router();
const controllerAuthentication = require("../controller/ControllerAutentication");

module.exports = function () {

    router.post("/register", controllerAuthentication.Register);

    router.post("/login", controllerAuthentication.Login);

    return router;
};