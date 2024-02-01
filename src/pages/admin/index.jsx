import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from 'html2canvas';

import { Navbar } from "../../components";
import { Grafic, Money, MoneyF, Swath, Print, Cam, Card } from "../../libs/icons";
import { CaixaService } from "../../service/caixa/CaixaService";
import { ComandaService } from "../../service/comanda/ComandaService";

export const Admin = () => {

    const [idCaixa, setIdCaixa] = useState("");
    const [receita, setReceita] = useState(0);
    const [totalComandas, setTotalComandas] = useState(0);
    const [totalProdutos, setTotalProdutos] = useState(0);

    const [totalPix, setTotalPix] = useState(0);
    const [totalDebito, setTotalDebito] = useState(0);
    const [totalCredito, setTotalCredito] = useState(0);
    const [totalDinheiro, setTotalDinheiro] = useState(0);
    const [data, setData] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getAllData();
         let data = new Date().toLocaleDateString("pt-BR");

        setData(data)
    }, []);

    const getAllData = useCallback(() => {
        try {
            CaixaService.getAll()
                .then((result) => {
                    setIdCaixa(result.data[0]._id);
                    setTotalComandas(result.data[0].comandas.length);
                    setReceita(parseFloat(result.data[0].totalValue).toFixed(2).replace(".", ","));

                    let totalProdutos = 0;

                    for (let i = 0; i < result.data[0]["comandas"].length; i++) {
                        let comanda = result.data[0]["comandas"][i]["products"].length;

                        totalProdutos += comanda;
                    };
                    setTotalProdutos(totalProdutos);

                    let totalPix = 0;
                    let totalDebito = 0;
                    let totalCredito = 0;
                    let totalDinheiro = 0;

                    for (let i = 0; i < result.data[0]["comandas"].length; i++) {

                        let pagForm = result.data[0]["comandas"][i]["pagForm"];

                        switch (pagForm) {
                            case "pix":
                                totalPix += result.data[0]["comandas"][i]["totalValue"]; break;
                            case "dinheiro":
                                totalDinheiro += result.data[0]["comandas"][i]["totalValue"]; break;
                            case "credito":
                                totalCredito += result.data[0]["comandas"][i]["totalValue"]; break
                            case "debito":
                                totalDebito += result.data[0]["comandas"][i]["totalValue"]; break;
                            default: return;
                        };
                    };

                    setTotalPix(parseFloat(totalPix).toFixed(2).replace(".", ","));
                    setTotalDebito(parseFloat(totalDebito).toFixed(2).replace(".", ","));
                    setTotalCredito(parseFloat(totalCredito).toFixed(2).replace(".", ","));
                    setTotalDinheiro(parseFloat(totalDinheiro).toFixed(2).replace(".", ","));
                });
        } catch (error) {
            toast.error("Ocorreu um erro ao comunicar com o DB");
        };
    }, []);

    const fecharCaixa = () => {

        try {
            CaixaService.deleteById(idCaixa);
            ComandaService.deleteAll();
            CaixaService.getAll();

            capturatCaixa();
            navigate("/garcom/comandas");
        } catch (error) {
            toast.error("Ocorreu um erro ao comunicar com o DB");
        };
    };

    const capturatCaixa = () => {
        const node = document.getElementById('resumoDia');

        html2canvas(node).then((canvas) => {
            const dataUrl = canvas.toDataURL();

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `caixa-dia-${data}.png`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
        });
    };

    const imprimirCaixa = () => {
        const janelaDeImpressao = window.open('', '_blank');
        janelaDeImpressao.document.write('<html><head><title>Imprimir</title></head><body>');
        janelaDeImpressao.document.write(`<p>Receita Total Gerada: <b>R$ ${receita}</b></p>`);
        janelaDeImpressao.document.write(`<p>Total de Comandas: <b>${totalComandas}</b></p>`);
        janelaDeImpressao.document.write(`<p>Total de Produtos Vendidos: <b>${totalProdutos}</b></p>`);
        janelaDeImpressao.document.write(`<p>Vendas por categoria</p>`);
        janelaDeImpressao.document.write(`<p>Pix: <b>R$ ${totalPix}</b></p>`);
        janelaDeImpressao.document.write(`<p>Dineiro: <b>R$ ${totalDinheiro}</b></p>`);
        janelaDeImpressao.document.write(`<p>Cartão Crédito: <b>R$ ${totalCredito}</b></p>`);
        janelaDeImpressao.document.write(`<p>Cartão Débito: <b>R$ ${totalDebito}</b></p>`);
        janelaDeImpressao.document.write('</body></html>');
        janelaDeImpressao.document.close();
        janelaDeImpressao.print();
    };

    return (
        <>
            <Navbar title={"Resumo do dia"} isLogout />
            <div className="w-full flex flex-col items-center">
                <Toaster />
                <div className="flex justify-between bg-slate-100/20 py-5 px-1 w-[97%] my-10 rounded-md shadow-md gap-1">

                    <button className="w-1/3 font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] hover:text-[#1C1d26] bg-[#1C1D26] transition-all delay-75"
                        onClick={() => navigate("/editeProduto")}
                    >Produtos</button>

                    <button className="w-1/3 font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] hover:text-[#1C1d26] bg-[#1C1D26] transition-all delay-75"
                        onClick={() => navigate("/usuarios")}
                    >Usuários</button>

                    <button className="w-1/3 font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] hover:text-[#1C1d26] bg-[#1C1D26] transition-all delay-75"
                        onClick={() => navigate("/garcom/comandas")}
                    >Comandas</button>
                </div>

                <main className="w-full my-10 pb-10 flex flex-col items-center gap-14" id="resumoDia">
                    <div className="flex gap-10 flex-col">

                        <p><span className="font-semibold text-[#1C1d26]">Data:</span> {data}</p>

                        <p className="text-2xl text-green-600">Receita</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Money />
                            <div className="text-end">
                                <p className="text-slate-400">Receita Total Gerada</p>
                                <p className="text-2xl">R$ {receita}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-10 flex-col">
                        <p className="text-2xl text-orange-600">Vendas</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20 cursor-pointer"
                            onClick={() => navigate("/comandasFinalizadas")}
                        >

                            <Swath />
                            <div className="text-end">
                                <p className="text-slate-400">Total de comandas</p>
                                <p className="text-2xl">{totalComandas} comanda{totalComandas === 1 ? "" : "s"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Grafic />
                            <div className="text-end">
                                <p className="text-slate-400">Total de produtos vendidos</p>
                                <p className="text-2xl">{totalProdutos}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-10 flex-col">
                        <p className="text-2xl text-orange-600">Vendas por categoria</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Grafic />
                            <div className="text-end">
                                <p className="text-slate-400">Pix</p>
                                <p className="text-2xl">R$ {totalPix}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <MoneyF />
                            <div className="text-end">
                                <p className="text-slate-400">Dinheiro</p>
                                <p className="text-2xl">R$ {totalDinheiro}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Card />
                            <div className="text-end">
                                <p className="text-slate-400">Cartão Crédito</p>
                                <p className="text-2xl">R$ {totalCredito}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Card />
                            <div className="text-end">
                                <p className="text-slate-400">Cartão Débito</p>
                                <p className="text-2xl">R$ {totalDebito}</p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="w-full flex flex-col gap-3 justify-between items-center py-3 bg-[#EB8F00] text-slate-100">
                    <h5 className="text-[28px] font-semibold">Finalizar o dia</h5>

                    <div className="flex gap-5 w-2/3 justify-center items-center hidden">
                        <button className="flex gap-3 p-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => imprimirCaixa()}
                        ><Print /> Imprimir</button>
                        <button className="flex gap-3 p-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => capturatCaixa()}
                        ><Cam /> Print</button>
                    </div>

                    <button className="w-2/3 py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                        onClick={() => fecharCaixa()}
                    >Fechar caixa</button>
                </footer>
            </div>
        </>
    );
};
