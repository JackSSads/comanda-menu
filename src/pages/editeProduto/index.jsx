import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { ProdutoService } from "../../service/produto/ProdutoService";

export const EditeProduto = () => {

    const [value, setValue] = useState(0);
    const [category, setCategory] = useState("");
    const [nameProduct, setNameProduct] = useState("");

    const { id } = useParams();

    useEffect(() => {
        try {
            ProdutoService.getById(id)
                .then((result) => {
                    if (result.status) {
                        setValue(result.data["value"]);
                        setCategory(result.data["category"]);
                        setNameProduct(result.data["nameProduct"]);

                        return;
                    };

                    toast.error("Produto não encontrado!");
                })
                .catch(() => toast.error("Ocorreu um erro ao procurar pelo produto"));
        } catch (error) {
            toast.error("Erro ao consultar o Banco de Dados");
        };
    }, []);

    const handleNewValues = (onChange, action) => {
        if (action === "nameProduct") {
            setNameProduct(onChange.target.value);
        } else if (action === "category") {
            setCategory(onChange.target.value);
        } else if (action === "value") {
            setValue(onChange.target.value);
        };
    };

    const updateById = () => {
        if (nameProduct === "" || category === "" || value === 0) {
            return toast.error("Preencha todos os campos");
        };

        const data = {
            value,
            category,
            nameProduct,
            totalPrice: value,
        };

        try {
            ProdutoService.updateById(id, data)
                .then((result) => {
                    if (result.status) {
                        return toast.success("Produto atualizado");
                    } else {
                        toast.error("Erro ao atualizar produto");
                    };
                });
        } catch (error) {
            toast.error("Erro de comunicação do o DB");
        };
    };

    return (
        <>
            <Navbar title={`Edite o produto`} url={"/editeProduto"} />

            <div className="mx-10 flex justify-center items-center flex-col gap-5">
                <Toaster />
                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="text"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Digite o nome do produto"
                        onChange={(e) => handleNewValues(e, "nameProduct")}
                        value={nameProduct}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="number"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Digite o valor"
                        onChange={(e) => handleNewValues(e, "value")}
                        value={value}
                    />
                </label>

                <label className="flex flex-col text-slate-900 font-semibold">
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={category}
                        name="category"
                        onChange={(e) => handleNewValues(e, "category")}>
                        <option value={`Bebida`} >Bebida</option>
                        <option value={`Coquetel`} >Coquetel</option>
                        <option value={`Drink`} >Drink</option>
                        <option value={`Dose`} >Dose</option>
                        <option value={`Petisco`} >Petisco</option>
                    </select>
                </label>

                <button className="flex justify-center w-[250px] p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                    onClick={() => updateById()}
                >Atualizar produto</button>
            </div>
        </>
    );
};