require("dotenv").config();

const User = require('../models/User');

const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.cookie.split('Authorization=')[1];

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error("User not found");
        };

        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({ message: "Erro ao atutenticar" });
    };
};

module.exports = auth;