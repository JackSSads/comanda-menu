import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components/navbar";
import { Plus, Delete, Minus } from "../../libs/icons";
import { ProdutoService } from "../../service/produto/ProdutoService";
import { ComandaService } from "../../service/comanda/ComandaService";
import socket from "../../service/socket";

export const ListagemProdutos = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    // listagem de produtos do db
    const [listProducts, setListProducts] = useState([]);

    // reunindo produtos em uma lista para comanda
    const [addProductsTiket, setAddProductsTiket] = useState([]);

    // produtos que já estão na comanda
    const [getProductComanda, setGetProductComanda] = useState([]);

    const [client, setClient] = useState([]);

    // lista atualizada de produtos - antigos + novos
    const [newProductsComanda, setNewProductsComanda] = useState([]);

    // Estado que armazena o termo de filtro digitado
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        getProductService();
        getComandatService();
    }, []);

    useEffect(() => {
        setNewProductsInComanda();
    }, [addProductsTiket, getProductComanda]);

    const getProductService = useCallback(() => {
        try {
            ProdutoService.getAll()
                .then((result) => { setListProducts(result.data) })
                .catch((error) => { return toast.error(`Ocorreu um erro inesperado! ${error}`); });
        } catch (error) {
            return toast.error("Erro ao consultar o Banco de Dados");
        };
    }, []);

    const getComandatService = useCallback(() => {
        try {
            ComandaService.getById(id)
                .then((result) => {
                    setClient(result.data.nameClient);
                    setGetProductComanda(result.data.products);
                })
                .catch((error) => { return toast.error(`Ocorreu um erro inesperado! ${error}`); });
        } catch (error) {
            return toast.error("Erro ao consultar o Banco de Dados");
        };
    }, [id]);

    const setNewProductsInComanda = () => {
        setNewProductsComanda([...addProductsTiket, ...getProductComanda]);
    };

    const addProduct = (_id) => {
        // adicionar produtos

        listProducts.forEach(item => {
            if (item._id === _id) {
                //console.log(item);
                const newList = [item, ...addProductsTiket];

                setAddProductsTiket(newList);

                toast("Adicionado", { icon: "😉", duration: 1200 });

                return;
            };
        });
    };

    const removeProduct = (id) => {
        //remover item da lista

        const newValeu = addProductsTiket.filter(product => product["_id"] !== id);
        setAddProductsTiket(newValeu);

        toast("Removido", { icon: "🙄", duration: 1200 });
    };

    const obsProduct = (_id, value) => {
        // Adicionar obsevação a item
        // Primeiro adiciona o produto na lista e dps faz a observação

        const newList = [...addProductsTiket];
        const objEditedIndex = newList.findIndex(product => product._id === _id);

        // verificando se existe um produto para manipular
        if (objEditedIndex !== -1) {
            let objCloned = { ...newList[objEditedIndex] };
            objCloned.obs = value;
            newList[objEditedIndex] = objCloned;
            setAddProductsTiket(newList);
        } else {
            toast.error("Primeiro + adicione o produto!", { duration: 1200 });
        };
    };

    const alterQnt = async (_id, action) => {
        // Editando quantidade de cada item //

        const newList = [...addProductsTiket];
        const objEditedIndex = newList.findIndex(product => product._id === _id);

        // verificando se existe um produto para manipular
        if (objEditedIndex !== -1) {

            let objCloned = { ...newList[objEditedIndex] };

            if (action === "+") {
                objCloned.qnt += 1;
                toast(`${objCloned.qnt}`, { icon: "😎", duration: 1200 });
            } else if (action === "-" && objCloned.qnt > 1) {
                objCloned.qnt -= 1;
                toast(`${objCloned.qnt}`, { icon: "😒", duration: 1200 });
            };

            objCloned.totalPrice = objCloned.qnt * objCloned.value;
            const indexObjEdited = newList.findIndex(index => index._id === _id);
            newList[indexObjEdited] = objCloned;

            setAddProductsTiket(newList);
        } else {
            toast.error("Primeiro + adicione o produto!", { duration: 1200 });
        };
    };

    const postProducts = async () => {
        // enviar novos produtos para a comanda

        // verifica se existe itens na lista
        if (addProductsTiket.length === 0) {
            return toast.error("Adicione produtos", { duration: 2000 });
        };

        // calculando valor total dos pedidos
        let totalValueCalculed = 0;

        for (let i = 0; i < newProductsComanda.length; i++) {
            let value = Number(newProductsComanda[i]["totalPrice"]);

            totalValueCalculed += value;
        };

        const data = {
            products: newProductsComanda,
            totalValue: totalValueCalculed,
            status: true
        };

        try {
            ComandaService.updateById(id, data)
                .then(() => { navigate(`/garcom/comanda/${id}`); })
                .catch((error) => { return toast.error(`Ocorreu um erro inesperado! ${error}`); });

            socket.emit("novo_pedido", client);
        } catch (error) {
            return toast.error("Ocorreu um erro inesperado!");
        };
    };

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    const itensFiltrados = listProducts.filter(item =>
        item.nameProduct.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <>
            <Navbar title={`Produtos`} url={`/garcom/comanda/${id}`} />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[200px] px-3 rounded-xl flex items-center flex-col gap-10">
                <Toaster />
                <div className="fixed bottom-0 flex flex-col items-center justify-center w-full  bg-[#EB8F00]/95 p-1 text-slate-100">

                    {addProductsTiket.length ? (
                        <h5 className="text-xl my-3"><span className="font-bold">{addProductsTiket.length}</span> produtos</h5>
                    ) : (
                        <h5 className="text-xl my-3">Adicione items para a comanda</h5>
                    )}

                    <button className="w-1/2 flex justify-center gap-1 p-3 rounded-md text-white font-semibold bg-[#171821] hover:text-[#171821] border-2 border-transparent hover:border-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                        onClick={() => postProducts()}
                    >Adicionar</button>
                </div>

                <div className="px-3 py-5 w-full rounded-xl shadow-md">
                    <label>
                        <input
                            type="text"
                            className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Buscar produto..."
                            onChange={(e) => handleFiltroChange(e)}
                            value={filtro}
                        />
                    </label>
                </div>

                {itensFiltrados.map((e, index) => (
                    <div key={index} className="flex justify-between items-center px-3 py-5 w-full rounded-xl shadow-md">

                        <div className="w-2/3 flex flex-col items-start">
                            <h3 className="text-slate-900 font-bold">{e.nameProduct}</h3>
                            <h3 className="text-slate-500 text-[15px] font-semibold">R$ {e.value.toFixed(2).replace(".", ",")}</h3>
                            <label >
                                <input
                                    type="text" placeholder="Observação"
                                    className="w-full mt-1 border border-slate-500 rounded-[5px] p-1"
                                    onChange={(event) => obsProduct(e._id, event.target.value)}
                                />
                            </label>
                        </div>

                        <div className="h-full ml-5 flex flex-col items-center gap-5 border-l-2 pl-5">
                            <div className="flex items-center gap-3 border-2 border-slate-500 rounded-md">
                                <button className="border-r-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => alterQnt(e._id, "-")}
                                ><Minus /></button>

                                <p className="text-[#EB8F00] font-somibold">
                                    {addProductsTiket.find(product => product._id === e._id)?.qnt || 0}
                                </p>

                                <button className="border-l-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => alterQnt(e._id, "+")}
                                ><Plus /></button>
                            </div>

                            <div className="flex gap-5">
                                <button className="text-[#1C1D26] p-2 rounded-md bg-[#EB8F00] hover:text-white hover:bg-[#1C1D26] transition-all delay-75"
                                    onClick={() => addProduct(e._id)}
                                ><Plus /></button>

                                <button className="text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => removeProduct(e._id)}
                                ><Delete /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};