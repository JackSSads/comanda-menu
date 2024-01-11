import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { CaixaService } from "../../service/caixa/CaixaService";
import { ComandaService } from "../../service/comanda/ComandaService";
import socket from "../../service/socket";

export const FinalizarComanda = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [vessel, setVessel] = useState("");
    const [products, setProducts] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [client, setClient] = useState("");

    const [comanda, setComanda] = useState([]);
    const [caixa, setCaixa] = useState([]);
    const [idCaixa, setIdCaixa] = useState("");
    const [uniao, setUniao] = useState([]);

    const [selPagId, setSelPagId] = useState("pix");

    useEffect(() => {
        getComanda();
        getAllCaixa()
    }, []);

    useEffect(() => {

        const newComanda = {
            nameClient: client,
            pagForm: selPagId,
            products,
            status: false,
            totalValue,
            vessel
        };

        setUniao(() => [...caixa, newComanda]);
    }, [caixa, comanda, selPagId]);

    const getComanda = useCallback(() => {

        try {
            ComandaService.getById(id)
                .then((result) => {
                    setTotalValue(result.data.totalValue)
                    setClient(result.data.nameClient);
                    setProducts(result.data.products);
                    setVessel(result.data.vessel);
                    setComanda(result.data);
                });

        } catch (error) {
            toast.error("Ocorreu um erro na comunicação com o DB");
        };

    }, [id]);

    const getAllCaixa = useCallback(() => {
        try {
            CaixaService.getAll()
                .then((result) => {
                    setCaixa(result.data[0].comandas);
                    setIdCaixa(result.data[0]._id);
                });
        } catch (error) {
            toast.error("Ocorreu um erro na comunicação com o DB");
        };
    }, []);

    const editStatusComanda = () => {

        const data = {
            _id: comanda._id,
            nameClient: comanda.nameClient,
            vessel: comanda.vessel,
            products: comanda.products,
            status: false,
            totalValue: comanda.totalValue,
            pagForm: selPagId,
        };

        try {
            ComandaService.updateById(id, data)
                .then((result) => {
                    setComanda(result.data);
                });

        } catch (error) {
            toast.error("Ocorreu um erro na comunicação com o DB");
        };
    };

    const closeComanda = () => {
        editStatusComanda();

        let totalValueCalculed = 0;

        for (let i = 0; i < uniao.length; i++) {
            let soma = uniao[i]["totalValue"];

            totalValueCalculed += soma;
        };

        const obj = {
            comandas: uniao,
            status: false,
            totalValue: totalValueCalculed
        };

        try {
            CaixaService.updateById(idCaixa, obj)
                .then(() => {
                    socket.emit("comanda_finalizada", client);
                    navigate("/garcom/comandas");
                });
        } catch (error) {
            toast.error("Ocorreu um erro na comunicação com o DB");
        };
    };

    const cancelarComanda = () => {
        try {
            ComandaService.deleteById(id);
            socket.emit("comanda_cancelada", { client, id });
            navigate("/garcom/comandas");
        } catch (error) {
            toast.error("Ocorreu um erro na comunicação com o DB");
        };
    };

    return (
        <>
            <Navbar title={`Fechar Comanda`} url={`/garcom/comanda/${id}`} />
            <div className="w-[95%] min-h-[100vh] m-2 p-1 rounded-xl flex items-center justify-center flex-col gap-14">
                <Toaster />
                <div className="px-10 py-14 rounded-md shadow-xl bg-[#D39825]/10">
                    <ul className="max-w-2/3 flex gap-5 flex-col divide-y divide-dashed divide-slate-700">
                        {products.map((e, index) => (
                            <li key={index}
                                className="w-[100%] flex justify-between gap-5 text-slate-700 font-semibold">
                                <span><span className="text-[#EB8F00]">{e.qnt}x</span> - {e.nameProduct}</span><span className="font-bold text-slate-500">R$ {e.totalPrice.toFixed(2).replace(".", ",")}</span>
                            </li>
                        ))}
                    </ul>

                    <h2 className="mt-5 text-center text-slate-900 font-bold text-[22px]">
                        Consumo: <span className="text-slate-500">R$ {parseFloat(totalValue).toFixed(2).replace(".", ",")}</span>
                    </h2>
<h2 className="flex flex-col mt-5 text-center text-slate-900 font-bold text-[28px]">
                        Total + 10%: <span className="text-slate-500">R$ {parseFloat(totalValue + (totalValue * 0.1)).toFixed(2).replace(".", ",")}</span>
                    </h2>
                </div>

                <label className="flex flex-col text-slate-900 text-[20px] font-semibold">
                    Pagar com:
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={selPagId}
                        name="selPag"
                        defaultValue={`pix`}
                        onChange={(e) => setSelPagId(e.target.value)}>
                        <option value={`pix`} >Pix</option>
                        <option value={`dinheiro`} >Dinheiro</option>
                        <option value={`cartao`} >Cartão</option>
                    </select>
                </label>

                <button className="w-[250px] p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                    onClick={() => closeComanda()}
                >Finalizar Comanda</button>

                <button className="mt-20 w-[250px] p-3 font-semibold rounded-xl bg-red-600 text-white transition-all delay-75"
                    onClick={() => cancelarComanda()}
                >Cancelar Comanda</button>
            </div>
        </>
    );
};