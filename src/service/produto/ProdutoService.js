import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/produto");

        if (res) return res.data;

        return new Error("Erro ao carregar produtos!");
    } catch (error) {
        return new Error("Erro ao conexão com o banco de dados!");
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/produto/${id}`);

        if (res) return res.data;

        return new Error("Erro ao carregar produtos!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/produto", data);

        if (res) return res.data;

        return new Error("Erro ao criar produto!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/produto/${id}`, data);

        if (res) return res.data;

        return new Error("Erro ao atualizar a produto!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/produto/${id}`);

        if (res) return res.data;

        return new Error("Erro ao deletar produto!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

export const ProdutoService = {
    create,
    getAll,
    getById,
    updateById,
    deleteById,
};