import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/comanda");

        if (res) return res.data;

        return new Error("Erro ao carregar comandas!");
    } catch (error) {
        return new Error("Erro ao consultar DB!");
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/comanda/${id}`);

        if (res) return res.data;

        return new Error("Erro ao carregar comandas!");
    } catch (error) {
        return new Error("Erro ao consultar DB!");
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/comanda", data);

        if (res) return res.data;

        return new Error("Erro ao criar comanda!");
    } catch (error) {
        return new Error("Erro ao consultar DB!");
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/comanda/${id}`, data);

        if (res) return res.data;

        return new Error("Erro ao atualizar a comanda!");
    } catch (error) {
        return new Error("Erro ao consultar DB!");
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/comanda/${id}`);

        if (res) return res.data;

        return new Error("Erro ao deletar comanda!");
    } catch (error) {
        return new Error("Erro ao consultar DB!");
    };
};

const deleteAll = async () => {
    try {
        const res = await API.delete(`/comanda`);

        if (res) return res.data;

        return new Error("Erro ao deletar comandas!");
    } catch (error) {
        return new Error("Erro ao consultar DB!");
    };
};

export const ComandaService = {
    create,
    getAll,
    getById,
    updateById,
    deleteAll,
    deleteById,
};