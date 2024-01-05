import { Routes, Route, Navigate } from "react-router-dom";

import {
    Admin,
    Login,
    Garcom,
    Producao,
    EditeProduto,
    ListaComandas,
    ShowEditProdutos,
    ListagemProdutos,
    FinalizarComanda,
    CadastroProdutos,
    GerenciarUsuarios,
} from "../pages";

export const AppRoutes = () => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path={`/:funcao/comandas`} element={<ListaComandas />} />
            
            <Route path={`/:funcao/producao`} element={<Producao />} />

            <Route path={`/:funcao/comanda/:id`} element={<Garcom />} />
            <Route path={`/garcom/comanda/:id/add-product`} element={<ListagemProdutos />} />
            <Route path={`/garcom/comanda/:id/fechar-comanda`} element={<FinalizarComanda />} />

            <Route path={`/admin`} element={<Admin />} />
            <Route path={`/usuarios`} element={<GerenciarUsuarios />} />
        
            <Route path={`/novoProduto`} element={<CadastroProdutos />} />
            <Route path={`/editeProduto`} element={<ShowEditProdutos />} />
            <Route path={`/editeProduto/:id`} element={<EditeProduto />} />

            <Route path="*" element={<Navigate to={"/login"} />} />
        </Routes>
    );
};