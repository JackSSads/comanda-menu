import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Plus } from "../../libs/icons";
import { Navbar } from "../../components";
import { ProdutoService } from "../../service/produto/ProdutoService";

export const CadastroProdutos = () => {

    const [nameProduct, setNameProduct] = useState("");
    const [value, setValue] = useState(parseFloat(0).toFixed(2).replace(".", ","));
    const [category, setCategory] = useState("Bebida");

    const handleInput = (onChange, action) => {
        if (action === "name") {
            setNameProduct(onChange.target.value);
        } else if (action === "value") {
            setValue(onChange.target.value);
        } else if (action === "category") {
            setCategory(onChange.target.value);
        };
    };

    const createNewProduct = () => {

        if (nameProduct === "" || category === "" || value === 0) {
            return toast.error("preencha todos os campos");
        };

        const data = {
            nameProduct,
            qnt: 1,
            totalPrice: value,
            value,
            category,
            status: true,
        };

        try {
            ProdutoService.create(data)
                .then((result) => {
                    if (result.status) toast.success(result.message);

                    setValue("");
                    setCategory("");
                    setNameProduct("");
                });
        } catch (error) {
            alert(new Error("Erro de comunicação do o DB"));
        };
    };

    return (
        <>
            <Navbar title={"Cadastro de produtos"} url={"/editeProduto"} />
            <div className="mx-10 flex justify-center items-center flex-col gap-5">
                <Toaster />
                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="text"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Produto"
                        onChange={(e) => handleInput(e, "name")}
                        value={nameProduct}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="number"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Preço"
                        onChange={(e) => handleInput(e, "value")}
                        value={value}
                    />
                </label>

                <label className="flex flex-col text-slate-900 font-semibold">
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={category}
                        name="category"
                        defaultValue={`bebida`}
                        onChange={(e) => handleInput(e, "category")}>
                        <option value={`Bebida`} >Bebida</option>
                        <option value={`Drink`} >Sucos & Drinks</option>
                        <option value={`Petisco`} >Petisco</option>
                        <option value={`Porcao`} >Porção</option>
                        <option value={`Refeicao`} >Refeição</option>
                        <option value={`Salada`} >Salada</option>
                        <option value={`Doce`} >Doce</option>
                    </select>
                </label>

                <button className="flex justify-center w-[250px] p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                    onClick={() => createNewProduct()}
                ><Plus /> Cadastrar item</button>
            </div>
        </>
    );
};