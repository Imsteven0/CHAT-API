const SchemaUser = require("../models/user");
const bcrypt = require("bcryptjs");

exports.listUsers = async (req, res, next) => {
    try {
        const users = await SchemaUser.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({error: "No se pudo recuperar usuarios"});
    }
};

exports.saveUser = async (req, res, next) => {
    try {
        const userData = req.body;
        userData.hashedPassword = await bcrypt.hash(userData.hashedPassword, 10)
        const newUser = new SchemaUser(userData);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "No se pudo guardar el usuario"});
    }
};


exports.listUsersByName = async (email) => {
    try {
        let query = {};

        if (email) query = {email: {$regex: email, $options: 'i'}};

        return await SchemaUser.find(query).limit(5);
    } catch (error) {
        console.log(error);
        return [];
    }
};