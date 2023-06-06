const SchemaUser = require("../models/user");

exports.listUsers = async (req, res, next) => {
  try {
    const users = await SchemaUser.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "No se pudo recuperar usuarios" });
  }
};

exports.saveUser = async (req, res, next) => {
  try {
    const userData = req.body; 
    const newUser = new SchemaUser(userData);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar el usuario" });
  }
};
