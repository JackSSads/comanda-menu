import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {

    const tokenCookie = document.cookie.split(';');

    // procurando o token de autenticação
    const isAuthorizad = tokenCookie.filter(auth => auth.includes("Authorization"));

    // buscando o token no sessionStorege
    const auth = localStorage.getItem("Authorization");

    // caso o token não esteja no cookie, será acidionado
    if (!isAuthorizad.length) {
        document.cookie = `Authorization=${auth}`;
    };

    return auth ? children : <Navigate to="/login" />;
};