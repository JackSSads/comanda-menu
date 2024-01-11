import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { ComandaService } from "../../service/comanda/ComandaService";
import socket from "../../service/socket";

export const Producao = () => {

    const { funcao } = useParams();

    const [allComandas, setAllComandas] = useState([]);
    const [allProduts, setAllProduts] = useState([]);

    useEffect(() => {
        getAllComandas();
    }, []);

    useEffect(() => {
        listAllProducts();
    }, [allComandas]);

    // lista_novo_pedido
    useEffect(() => {
        socket.on("lista_novo_pedido", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6>Novo pedido na comanda</h6>
                        <span className="font-semibold">{data}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getAllComandas();
        });

        return () => { socket.off("lista_novo_pedido") };
    }, []);

    // produto_removido
    useEffect(() => {
        socket.on("produto_removido", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6>Pedido <span className="font-semibold">{data.product.nameProduct}</span> cancelado na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getAllComandas();
        });

        return () => { socket.off("produto_removido") };
    }, []);

    // alterar_quantidade
    useEffect(() => {
        socket.on("alterar_quantidade", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6><span className="font-semibold">{data.action} {data.product.nameProduct}</span> na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });

            getAllComandas();

            return () => { socket.off("alterar_quantidade") };
        });
    }, []);

    // comanda_cancelada
    useEffect(() => {
        socket.on("comanda_cancelada", (data) => {
            toast((t) => (
                <div>
                    <h5>Comanda <span className="font-semibold">{data.client}</span> cancelada</h5>
                </div>
            ), { duration: 2000 });
        });

        getAllComandas();

        return () => { socket.off("comanda_cancelada") };
    }, []);

    // buscar todas as comandas
    const getAllComandas = useCallback(async () => {
        try {
            await ComandaService.getAll()
                .then((result) => {
                    setAllComandas(result.data);
                }).catch(() => { return /* toast.error(`Ocorreu um erro inesperado!`); */ });
        } catch (error) {
            return //toast.error("Erro ao consultar o Banco de Dados");
        };
    }, []);

    // comanda_finalizada
    useEffect(() => {
        socket.on("comanda_finalizada", (data) => {
            toast((t) => (
                <h6>Comanda <span className="font-semibold">{data}</span> finalizada</h6>
            ), { duration: 2000 });
            getAllComandas();
        });

        return () => { socket.off("comanda_finalizada") };
    }, []);

    // juntar todos os pedidos em um único array
    const listAllProducts = () => {

        let listProducts = [];

        allComandas.forEach(item => {

            // Verificando se existe pedidos em aberto na comanda
            // e status da comanda
            const hasProductWithTrueStatus = item.products.some(product => product.status);

            if (!hasProductWithTrueStatus || !item.status) return;
            // === //

            let data = {
                _id: item._id,
                status: item.status,
                products: item.products,
                nameClient: item.nameClient,
            };

            listProducts.push(data);

        });
        setAllProduts(listProducts);
    };

    // sinalizar pedido pronto
    const pedidoPronto = (indexComanda, nameProduct, nameClient, indexProduct, _idComanda) => {

        const newList = [...allProduts[indexComanda].products];

        // verificando se o indice é válido
        if (indexProduct >= 0 && indexProduct < newList.length) {
            newList[indexProduct] = { ...newList[indexProduct], status: false };
        } else {
            console.error("Índice de produto inválido");
            return;
        };

        try {
            const data = {
                products: newList,
                status: true,
            };

            ComandaService.updateById(_idComanda, data)
                .then((result) => {
                    if (result.status) {
                        getAllComandas();
                        return socket.emit("produto_pronto", { nameClient, nameProduct });
                    };
                });

        } catch (error) {
            return toast.error("Erro ao consultar o Banco de Dados!");
        };
    };

    return (
        <>
            <Navbar title={`Pedidos: ${funcao}`} />
            <Toaster />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-10">
                {allProduts.length > 0 ? allProduts.map((e, indexComanda) => (
                    <div key={e._id} className={` flex flex-col justify-center items-center px-3 py-5 w-full bg-slate-100/20 rounded-xl shadow-md`}>

                        <h3 className="font-bold">{e.nameClient}</h3>

                        {e.products.map((item, index) => (
                            <div key={index} className="flex justify-between items-center w-full">

                                {funcao === "barmen" && item.category === "Bebida" && item.status ? (

                                    <div className="flex justify-between items-center w-full mb-5 border-b-2 pb-2">

                                        <div className="flex flex-col mr-1">
                                            <h3 className="text-slate-900 font-semibold flex gap-1">{item.qnt}x - {item.nameProduct}</h3>

                                            {item.obs ? (
                                                <h3 className="text-slate-500 text-[15px] font-semibold">OBS: {item.obs}</h3>
                                            ) : false}
                                        </div>

                                        <div className=" flex gap-3 border-l-2 pl-3 text-white">
                                            <button className="flex gap-1 font-semibold rounded-xl p-3 bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                                disabled={!item.status}
                                                onClick={() => pedidoPronto(indexComanda, item.nameProduct, e.nameClient, item._id, e._id)}
                                            >{item.status ? "Pronto" : "Finalizado"}</button>
                                        </div>
                                    </div>
                                ) : false}

                                {funcao === "cozinha" && (
                                    item.category === "Drink" ||
                                    item.category === "Porcao" ||
                                    item.category === "Petisco" ||
                                    item.category === "Refeicao" ||
                                    item.category === "Salada"
                                ) && item.status ? (

                                    <div className="flex justify-between items-center w-full mb-5 border-b-2 pb-2">

                                        <div className="flex flex-col mr-1">
                                            <h3 className="text-slate-900 font-semibold flex gap-1">{item.qnt}x - {item.nameProduct}</h3>

                                            {item.obs ? (
                                                <h3 className="text-slate-500 text-[15px] font-semibold">OBS: {item.obs}</h3>
                                            ) : false}
                                        </div>

                                        <div className=" flex gap-3 border-l-2 pl-3 text-white">
                                            <button className="flex gap-1 font-semibold rounded-xl p-3 bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                                disabled={!item.status}
                                                onClick={() => pedidoPronto(indexComanda, item.nameProduct, e.nameClient, index, e._id)}
                                            >{item.status ? "Pronto" : "Finalizado"}</button>
                                        </div>
                                    </div>
                                ) : false}
                            </div>
                        ))}
                    </div>
                )) : (

                    <div className="flex justify-between items-center my-3 px-5 py-3 w-full rounded-xl shadow-md">

                        <div className="flex flex-col">
                            <h3 className="text-slate-900 font-bold">Você não possui pedidos em aberto</h3>
                            <h3 className="text-slate-400 font-semibold">Aguarde o garçom lançar algo ...</h3>
                            <h4 className="text-slate-500 text-[15px] font-semibold">
                                <span className="font-bold text-[#EB8F00]">Porque eu estou!</span> :)</h4>
                        </div>
                    </div>

                )}
            </div>
        </>
    );
};