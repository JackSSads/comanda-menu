import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/caixa");

        if (res) return res.data;

        return new Error("Erro ao carregar caixa!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/caixa/${id}`);

        if (res) return res.data;

        return new Error("Erro ao carregar caixa!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/caixa", data);

        if (res) return res.data;

        return new Error("Erro ao criar caixa!");
    } catch (error) {
        return new Error("Erro ao criar caixa!");
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/caixa/${id}`, data);

        if (res) return res.data;

        return new Error("Erro ao atualizar a caixa!");
    } catch (error) {
        return new Error("Erro ao atualizar a caixa!");
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/caixa/${id}`);

        if (res) return res.data;

        return new Error("Erro ao deletar caixa!");
    } catch (error) {
        return new Error("Erro ao deletar caixa!");
    };
};

export const CaixaService = {
    create,
    getAll,
    getById,
    updateById,
    deleteById,
};