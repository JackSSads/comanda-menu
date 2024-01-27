import { useEffect } from "react";

import { usePage } from "../../contexts";
import { useParams, useNavigate } from "react-router-dom";

export const Footer = ({ urlRedirect, valorTotal, data }) => {

    const navigate = useNavigate();
    const { funcao } = useParams();
    const { currentPage, setCurrentPage } = usePage();

    useEffect(() => {
        setCurrentPage(funcao);
    }, [valorTotal, data, currentPage, funcao, setCurrentPage]);

    const handleRedirect = () => {
        navigate(urlRedirect);
    };

    return (
        <>
            {currentPage === "garcom" ?
                (
                    <div className="fixed bottom-0 w-full h-[130px] flex flex-col justify-between items-center px-5 py-3 bg-[#EB8F00] text-slate-100">
                        <>
                            <h4 className="text-[22px] font-bold text-white">Valor Total: <span className="font-semibold text-[#1C1D26]">R$ {valorTotal}</span></h4>

                            <button className="w-2/3 px-1 py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                                onClick={() => handleRedirect()}
                            >Finalizar</button>
                        </>

                    </div>
                ) : <div className="fixed bottom-0 w-full h-[70px] flex flex-col justify-between items-center px-5 py-3 bg-[#EB8F00] text-slate-100">
                    </div>}
        </>
    );
};