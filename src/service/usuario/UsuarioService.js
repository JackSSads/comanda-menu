import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/usuario");

        if (res) return res.data;

        return new Error("Erro ao carregar usuarios!");
    } catch (error) {
        return new Error("Erro ao conexão com o banco de dados!");
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/usuario/${id}`);

        if (res) return res.data;

        return new Error("Erro ao carregar usuarios!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/usuario", data);

        if (res) return res.data;

        return new Error("Erro ao criar usuario!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/usuario/${id}`, data);

        if (res) return res.data;

        return new Error("Erro ao atualizar a usuario!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/usuario/${id}`);

        if (res) return res.data;

        return new Error("Erro ao deletar usuario!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

export const UsuarioService = {
    create,
    getAll,
    getById,
    updateById,
    deleteById,
};
