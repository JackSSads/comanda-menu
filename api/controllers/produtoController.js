const Produto = require("../models/Produto");

module.exports = class ProdutoController {
    static async getAll(req, res) {
        try {
            const data = await Produto.find({});

            return new Promise(() => res.status(200).json({ data, status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async getById(req, res) {
        const { id } = req.params;

        try {
            const data = await Produto.findOne({ _id: id });

            return new Promise(() => res.status(200).json({ data, status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async create(req, res) {
        const { nameProduct, value, qnt, totalPrice, category } = req.body;

        if (nameProduct === "" || value === "" || qnt === null) return res.json({ message: "Todos os campos são obrigatórios", status: false });

        try {
            const data = { nameProduct, value, qnt, totalPrice, category, status: true, obs: "" };

            await Produto.create(data);

            return new Promise(() => res.status(200).json({ message: "Produto cadastrado com sucesso", status: true }));

        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async updateById(req, res) {
        const { id } = req.params;
        const { nameProduct, value, qnt, totalPrice } = req.body;

        try {
            const data = { nameProduct, value, qnt, totalPrice };

            await Produto.updateOne({ _id: id }, data);

            return new Promise(() => res.status(200).json({ message: "Produto atualizado", status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };

    static async deleteById(req, res) {
        const { id } = req.params;

        if (!id) return res.status(500).json({ message: "Cliente ineistente", status: false });

        try {
            await Produto.deleteOne({ _id: id });

            return new Promise(() => res.status(200).json({ message: "Comanda deletada", status: true }));
        } catch (error) {
            return new Promise(() => res.status(500).json({ message: "Erro ao realizar requizição", status: false }));
        };
    };
};