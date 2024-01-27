import { Routes, Route, Navigate } from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";

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
    ComandasFinalizadas,
} from "../pages";

export const AppRoutes = () => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path={`/:funcao/comandas`} element={
                <PrivateRoute>
                    <ListaComandas />
                </PrivateRoute>
            } />
            <Route path={`/:funcao/producao`} element={
                <PrivateRoute>
                    <Producao />
                </PrivateRoute>
            } />

            <Route path={`/:funcao/comanda/:id`} element={
                <PrivateRoute>
                    <Garcom />
                </PrivateRoute>
            } />
            <Route path={`/garcom/comanda/:id/add-product`} element={
                <PrivateRoute>
                    <ListagemProdutos />
                </PrivateRoute>
            } />
            <Route path={`/garcom/comanda/:id/fechar-comanda`} element={
                <PrivateRoute>
                    <FinalizarComanda />
                </PrivateRoute>
            } />

            <Route path={`/admin`} element={
                <PrivateRoute>
                    <Admin />
                </PrivateRoute>
            } />
            <Route path={`/usuarios`} element={
                <PrivateRoute>
                    <GerenciarUsuarios />
                </PrivateRoute>
            } />
            <Route path={`/comandasFinalizadas`} element={
                <PrivateRoute>
                    <ComandasFinalizadas />
                </PrivateRoute>
            } />

            <Route path={`/novoProduto`} element={
                <PrivateRoute>
                    <CadastroProdutos />
                </PrivateRoute>
            } />
            <Route path={`/editeProduto`} element={
                <PrivateRoute>
                    <ShowEditProdutos />
                </PrivateRoute>
            } />
            <Route path={`/editeProduto/:id`} element={
                <PrivateRoute>
                    <EditeProduto />
                </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to={"/login"} />} />
        </Routes>
    );
};