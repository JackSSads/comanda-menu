const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = class UserController {
    static async getAll(req, res) {
        try {
            const data = await User.find();

            return new Promise(() => res.status(200).json({ data, status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async getById(req, res) {
        const { id } = req.params;

        try {
            const data = await User.findOne({ _id: id });

            if (!data) return res.status(500).json({ message: "Erro ao buscar usuário", status: false });

            return new Promise(() => res.status(200).json({ data, status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async create(req, res) {
        const { nameUser, func, email, pass } = req.body;

        try {
            const user = { nameUser, func, email, pass: bcrypt.hashSync(pass, 8) };

            await User.create(user);

            return new Promise(() => res.status(201).json({ message: "Usuário cadastrado com sucesso", status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async updateById(req, res) {
        const { id } = req.params;
        const { nameClient, func, email, pass } = req.body;

        try {

            const data = { nameClient, func, email, pass: bcrypt.hashSync(pass, 8) };

            await User.updateOne({ _id: id }, data);

            return new Promise(() => res.status(200).json({ message: "Comanda atualizada", status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async deleteById(req, res) {
        const { id } = req.params;

        if (!id) return res.status(500).json({ message: "Cliente ineistente!", status: false });

        try {
            await User.deleteOne({ _id: id });

            return new Promise(() => res.status(200).json({ message: "Usuário deletado", status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };
};