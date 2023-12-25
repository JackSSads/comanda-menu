const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class LoginController {
    static async login(req, res) {

        try {
            const { email, pass } = await req.body;

            const user = await User.findOne({ email });

            if (user.pass == undefined) {
                return res.json({ message: 'Usuário e/ou senha incorretos', status: false });
            };

            const passCompared = bcrypt.compareSync(pass, user.pass);

            if (!user || !passCompared) {
                return res.json({ message: 'Senha incorreta', status: false });
            };

            if (user && passCompared) {

                const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
                    expiresIn: '7d' // expires in 5min
                });

                res.cookie('Authorization', token);

                const result = {
                    func: user.func,
                    status: true
                };

                return res.status(200).json(result);
            };

        } catch (error) {
            return res.status(500).json({ message: `Erro de autenticação`, status: false });
        };
    };
};