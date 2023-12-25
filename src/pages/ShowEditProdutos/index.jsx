import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { Delete, Edit } from "../../libs/icons";
import { ProdutoService } from "../../service/produto/ProdutoService";

export const ShowEditProdutos = () => {

    const [listProducts, setListProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getAll();
    }, []);

    const getAll = () => {
        try {
            ProdutoService.getAll()
                .then((result) => { setListProducts(result.data) })
                .catch((error) => { return new Error(error) });

            setListProducts(listProducts);
        } catch (error) {
            toast.error("Erro ao consultar o Banco de Dados");
        };
    };

    const getById = (_id) => {

        navigate(`/editeProduto/${_id}`);
    };

    const deleteById = (_id) => {
        try {
            ProdutoService.deleteById(_id)
                .then((result) => {
                    if (result.status) {
                        getAll();
                        toast.success("Produto deletado");
                    };
                })
                .catch(() => toast.error("Ocorreu um erro ao procurar pelo produto"));
        } catch (error) {
            toast.error("Erro ao consultar o Banco de Dados");
        };
    };

    return (
        <>
            <Navbar title={"Edite Produtos"} url={"/admin"} />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-6">
            <Toaster />
                {listProducts.length === 0 && (
                    <div className="font-semibold text-xl">Nem um produto foi encontrado</div>
                )}

                {listProducts.map((e) => (
                    <div key={e._id} className="flex justify-between bg-slate-100/20 items-center px-3 py-5 w-full rounded-xl shadow-md">

                        <div className="w-2/3 flex flex-col items-start">
                            <h3 className="text-slate-900 font-bold">{e.nameProduct}</h3>
                            <h3 className="text-slate-500 text-[15px] font-semibold">R$ {e.value.toFixed(2).replace(".", ",")}</h3>
                            <h3 className="text-[#EB8F00] text-[15px]">{e.category}</h3>
                        </div>

                        <div className="flex gap-8 border-l-2 pl-3">
                            <button className=" text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                onClick={() => getById(e._id)}
                            ><Edit /></button>

                            <button className=" text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                onClick={() => deleteById(e._id)}
                            ><Delete /></button>
                        </div>
                    </div>
                ))}

            </div>
        </>
    );
};