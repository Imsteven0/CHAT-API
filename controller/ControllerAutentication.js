const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SchemaUser = require("../models/user");
require("dotenv").config();

exports.Register = async (req, res, next) => {
    try {
        const {name, email, hashedPassword} = req.body;

        if (!(email && hashedPassword && name)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await SchemaUser.findOne({email});

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        const encryptedPassword = await bcrypt.hash(hashedPassword, 10);

        const user = await SchemaUser.create({
            name,
            image: 'http://localhost:8000/imgs/avatarDefautl.jpg',
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            hashedPassword: encryptedPassword,
        });

        const token = jwt.sign(
            {user_id: user._id, name: user.name},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        res.status(201).json({token: token});
    } catch (err) {
        console.log(err);
    }
};

exports.Login = async (req, res, next) => {
    try {
        const {email, hashedPassword} = req.body;

        if (!(email && hashedPassword)) {
            res.status(400).send("All input is required");
        }

        const user = await SchemaUser.findOne({email});

        if (user && (await bcrypt.compare(hashedPassword, user.hashedPassword))) {
            const token = jwt.sign(
                {user_id: user._id, name: user.name},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            res.status(200).json({token: token});
        } else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
};