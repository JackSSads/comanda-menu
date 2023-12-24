import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { usePage } from "../../contexts";
import { Plus } from "../../libs/icons";
import { Navbar, NovaComanda } from "../../components";
import { ComandaService } from "../../service/comanda/ComandaService";
import socket from "../../service/socket";

export const ListaComandas = () => {

    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const { funcao } = useParams();
    const { visibilitNewTicket, setVisibilitNewTicket, currentPage } = usePage();
    const [visibilitButtonNewTicket, setButtonVisibilitNewTicket] = useState(currentPage);

    useEffect(() => {

        if (funcao === "garcom") setButtonVisibilitNewTicket(true);

        handleComandas();

    }, [visibilitButtonNewTicket, currentPage, visibilitNewTicket]);

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
                        onClick={() => {
                            toast.dismiss(t.id);
                            handleComandas();
                        }}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            handleComandas();
        });

        return () => { socket.off("lista_novo_pedido") };
    }, []);

    // nova_comanda
    useEffect(() => {
        socket.on("nova_comanda", () => {
            toast("Nova comanda");
            handleComandas();
        });

        return () => { socket.off("nova_comanda") };
    }, []);

    // comanda_finalizada
    useEffect(() => {
        socket.on("comanda_finalizada", (data) => {
            toast((t) => (
                <h6>Comanda <span className="font-semibold">{data}</span> finalizada</h6>
            ));
            handleComandas();
        });

        return () => { socket.off("comanda_finalizada") };
    }, []);

    // produto_pronto
    useEffect(() => {
        socket.on("produto_pronto", (data) => {
            if (funcao === "garcom") {
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
                handleComandas();
            };
        });

        return () => { socket.off("produto_pronto") };
    }, []);

    // produto_removido
    useEffect(() => {
        socket.on("produto_removido", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <h6 className="text-center">Pedido <span className="font-semibold">{data.product.nameProduct}</span> cancelado na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            handleComandas();
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

                handleComandas();

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

                handleComandas();

                return () => { socket.off("alterar_quantidade") };
            };

            return () => { socket.off("alterar_quantidade") };
        });
    }, []);

    // comanda_cancelada
    useEffect(() => {
        socket.on("comanda_cancelada", (data) => {
            toast(() => (
                <div>
                    <h5>Comanda <span className="font-semibold">{data.client}</span> cancelada</h5>
                </div>
            ));
        });

        handleComandas();
        return () => { socket.off("comanda_cancelada") };
    }, []);

    const handleComandas = useCallback(() => {
        try {
            ComandaService.getAll()
                .then((result) => { setRows(result.data) })
                .catch((error) => { return toast.error(`Ocorreu um erro inesperado! ${error}`); });
        } catch (error) {
            return toast.error("Ocorreu um erro inesperado!");
        };
    }, []);

    const handleUrl = (e) => {
        navigate(`/${funcao}/comanda/${e}`);
    };

    const handleVisibilitNewTicket = () => {
        setVisibilitNewTicket(true);
    };

    return (
        <>
            <Navbar title={`Todas as comandas`} />

            {!visibilitNewTicket ? (
                <div className="w-[95%] min-h-[90vh] py-3 px-5 rounded-xl flex items-center flex-col gap-5">
                    <Toaster />
                    {rows.length > 0 ? rows.map((e) => (
                        <div className={` ${e.status ? "flex" : "hidden"}  justify-between items-center my-3 px-5 py-3 w-full rounded-xl bg-slate-100/20 shadow-md`}
                            key={e._id}>

                            <div className="flex flex-col">
                                <h3 className="text-slate-900 font-bold">{e.nameClient}</h3>
                                <h3 className="text-slate-400 font-semibold">{e.vessel}</h3>
                                <h4 className="text-slate-500 text-[15px] font-semibold">
                                    <span className="font-bold text-[#EB8F00]">Total:</span> R$ {e.totalValue.toFixed(2).replace(".", ",")}</h4>
                                <p>{e.status ? "" : "Encerrada"}</p>
                            </div>

                            <button className=" p-2 rounded-md bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                onClick={() => handleUrl(`${e._id}`)}
                                disabled={!e.status}
                            ><Plus /></button>
                        </div>
                    )) : (
                        <div className="flex justify-between items-center my-3 px-5 py-3 w-full rounded-xl shadow-md">

                            <div className="flex flex-col">
                                <h3 className="text-slate-900 font-bold">Você não possui comandas em aberto</h3>
                                <h3 className="text-slate-400 font-semibold">Clique em + Nova comanda</h3>
                                <h4 className="text-slate-500 text-[15px] font-semibold">
                                    <span className="font-bold text-[#EB8F00]">Total:</span> R$ 0,00</h4>
                            </div>

                            <button className="p-2 rounded-md bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                            ><Plus /></button>
                        </div>
                    )}

                    {(visibilitButtonNewTicket && funcao === "garcom") ? (
                        <button className="mt-[100px] flex gap-1 font-semibold rounded-xl p-3 bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                            onClick={() => handleVisibilitNewTicket()}
                        ><Plus /> Nova comanda</button>
                    ) : false}
                </div>
            ) : (
                < NovaComanda />
            )}
        </>
    );
};