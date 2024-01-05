import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar, Footer } from "../../components";
import { Delete, Plus, Minus } from "../../libs/icons";
import { ComandaService } from "../../service/comanda/ComandaService";
import socket from "../../service/socket";

export const Garcom = () => {

    const navigate = useNavigate();
    const { id, funcao } = useParams();
    const [listData, setListData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [client, setClient] = useState("");

    useEffect(() => {
        getDataComanda();
    }, [totalPrice, id]);

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
            getDataComanda();
        });

        return () => { socket.off("lista_novo_pedido") };
    }, []);

    // nova_comanda
    useEffect(() => {
        socket.on("nova_comanda", () => {
            toast("Nova comanda", { duration: 2000 });
            getDataComanda();
        });

        return () => { socket.off("nova_comanda") };
    }, []);

    // comanda_finalizada
    useEffect(() => {
        socket.on("comanda_finalizada", (data) => {
            toast((t) => (
                <h6>Comanda <span className="font-semibold">{data}</span> finalizada</h6>
            ), { duration: 2000 });
            getDataComanda();
        });

        return () => { socket.off("comanda_finalizada") };
    }, []);

    // produto_pronto
    useEffect(() => {
        socket.on("produto_pronto", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <h6 className="text-center">Pedido <span className="font-semibold">{data.nameProduct}</span> pronto na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getDataComanda();
        });

        return () => { socket.off("produto_pronto") };
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
            getDataComanda();
        });

        return () => { socket.off("produto_removido") };
    }, []);

    // alterar_quantidade
    useEffect(() => {
        socket.on("alterar_quantidade", (data) => {

            if ((data.product.category === "Bebida" || data.product.category === "Drink" || data.product.category === "Dose")
                && funcao === "barmen") {

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

                getDataComanda();

                return () => { socket.off("alterar_quantidade") };
            } else if (data.product.category === "Petisco" && funcao === "churrasqueiro") {

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

                getDataComanda();

                return () => { socket.off("alterar_quantidade") };
            };

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

            if (data.id === id) {
                navigate(`/${funcao}/comandas`);
            };
        });

        getDataComanda();

        return () => { socket.off("comanda_cancelada") };
    }, []);

    const getDataComanda = useCallback(async () => {
        try {
            await ComandaService.getById(id)
                .then((result) => {
                    setClient(result.data.nameClient);
                    setListData(result.data.products);
                    setTotalPrice(parseFloat(result.data.totalValue).toFixed(2).replace(".", ","));
                }).catch((error) => { return toast.error(`Ocorreu um erro inesperado! ${error}`); });
        } catch (error) {
            return toast.error("Erro ao consultar o Banco de Dados");
        };
    }, []);

    const redirectAddProduct = () => {
        navigate(`/garcom/comanda/${id}/add-product`);
    };

    const alterQnt = async (_id, action, qnt) => {
        // EDITANDO QNT E TOTAL PRICE PRODUTO NA LISTA //
        const newList = [...listData];
        const objEdited = newList.find(product => product._id === _id);
        let objCloned = { ...objEdited };

        if (action === "+") {
            objCloned.qnt += 1;
            toast("+1", { icon: "😎", duration: 1200 });
            const data = { client, product: objEdited, action: "+1" };
            socket.emit("alterar_quantidade", data);
        } else if (action === "-" && qnt > 1) {
            objCloned.qnt -= 1;
            toast("-1", { icon: "😒", duration: 1200 });
            const data = { client, product: objEdited, action: "-1" };
            socket.emit("alterar_quantidade", data);
        };

        objCloned.totalPrice = objCloned.qnt * objCloned.value;
        const indexObjEdited = newList.findIndex(index => index._id === _id);
        newList[indexObjEdited] = objCloned;

        const newTotalPrice = newList.reduce((acc, product) => acc + product.totalPrice, 0);

        setListData(newList);

        const data = { products: newList, totalValue: newTotalPrice, status: true };

        try {
            await ComandaService.updateById(id, data)
            setTotalPrice(newTotalPrice.toFixed(2).replace(".", ","));

        } catch (error) {
            toast.error("Ocorreu um erro inesperado!");
        };
    };

    const deleteItem = async (index) => {
        // remover item da comanda pelo índice
        const newList = [...listData];

        if (index < 0 || index >= newList.length) {
            // Verificar se o índice está dentro dos limites válidos
            return toast.error("Índice inválido");
        };

        const deletedProduct = newList[index];
        const newTotalPrice = parseFloat(totalPrice) - deletedProduct.totalPrice;

        newList.splice(index, 1); // Remover o item pelo índice

        const data = { products: newList, totalValue: newTotalPrice, status: true };

        try {
            await ComandaService.updateById(id, data);
            setListData(newList);
            setTotalPrice(newTotalPrice.toFixed(2).replace(".", ","));
            toast("Removido", { icon: "😫", duration: 1500 });
            const dataN = { client, product: deletedProduct };
            socket.emit("produto_removido", dataN);
        } catch (error) {
            toast.error("Ocorreu um erro inesperado!");
        };
    };

    return (
        <>
            <Navbar title={`Cliente: ${client}`} url={`/${funcao}/comandas`} />

            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-10">
                <Toaster />
                <>
                    {listData.map((e, index) => (
                        <div key={index} className="flex justify-between items-center px-3 py-5 w-full bg-slate-100/20 rounded-xl shadow-md">
                            <div className="flex flex-col mr-1">
                                <h3 className="text-slate-900 font-bold flex gap-1">{funcao !== "garcom" && (<span>{e.qnt}x - </span>)}{e.nameProduct}</h3>

                                {funcao === "garcom" && (
                                    <h4 className="text-slate-500 text-[15px] font-semibold">R$ {e.totalPrice.toFixed(2).replace(".", ",")}</h4>
                                )}

                                {e.obs ? (
                                    <h3 className="text-slate-500 text-[15px] font-semibold">OBS: {e.obs}</h3>
                                ) : false}

                                {!e.status ? (
                                    <h3 className="text-slate-500 text-[15px] font-semibold">Pedido Pronto</h3>
                                ) : false}
                            </div>

                            <div className=" flex gap-3 border-l-2 pl-3 text-white">

                                {!e.status ? (
                                    <div className="flex gap-3 border-2 border-slate-500/30 rounded-md">
                                        <button className="border-r-2 border-slate-500/30 text-slate-900/30"
                                        ><Minus /></button>

                                        <p className="text-[#EB8F00] font-somibold">{e.qnt}</p>

                                        <button className="border-l-2 border-slate-500/30 text-slate-900/30"
                                        ><Plus /></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 border-2 border-slate-500 rounded-md">
                                        <button className="border-r-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                            onClick={() => alterQnt(e._id, "-", e.qnt)}
                                        ><Minus /></button>

                                        <p className="text-[#EB8F00] font-somibold">{e.qnt}</p>

                                        <button className="border-l-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                            onClick={() => alterQnt(e._id, "+")}
                                        ><Plus /></button>
                                    </div>
                                )}

                                <button className=" text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => deleteItem(index)}
                                ><Delete /></button>
                            </div>
                        </div>
                    ))}
                </>

                <button className="mt-[30px] flex gap-1 p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                    onClick={() => redirectAddProduct()}
                ><Plus /> Adicionar item</button>
            </div>

            <Footer urlRedirect={`/garcom/comanda/${id}/fechar-comanda`} data={listData} valorTotal={totalPrice} />
        </>
    );
};