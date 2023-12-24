import { API } from "../axiosConfig";

const login = async (data) => {
    try {
        const res = await API.post("/login", data);

        if (res) return res.data;

        return new Error("Erro ao realizar login!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

export const LoginService = {
    login
};