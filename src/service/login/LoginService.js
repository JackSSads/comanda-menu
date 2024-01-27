import { API } from "../axiosConfig";

const login = async (data) => {
    try {
        const res = await API.post("/login", data);

        if (res) {

            if (res.data.status) {
                const tokenCookie = document.cookie.split(';');
                const isAuthorizad = tokenCookie.filter(auth => auth.includes("Authorization"));
                
                if (isAuthorizad.length) {
                    const token = isAuthorizad[0].split('Authorization=')[1];
            
                    localStorage.setItem("Authorization", token)
                };
            };

            return res.data;
        };

        return new Error("Erro ao realizar login!");
    } catch (error) {
        return new Error("Erro na conexão com o Banco de dados!");
    };
};

export const LoginService = {
    login
};