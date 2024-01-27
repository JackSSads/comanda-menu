import { useNavigate } from "react-router-dom";

import { Back, ArrowRight } from "../../libs/icons";

export const Navbar = ({ title, url, isLogout }) => {

    const logoutButton = isLogout ? true : false;

    const navigate = useNavigate();

    const backOldPage = () => {
        navigate(url);
    };

    const logout = () => {
        localStorage.removeItem("Authorization");
        navigate("/login");
    };

    return (
        <nav className={`fixed top-0 w-full h-16 px-5 flex ${url ? "justify-between" : logout ? "justify-between" : "justify-center"} items-center bg-[#EB8F00] text-slate-100`}>
            <h2 className="font-bold uppercase text-[18px]">{title}</h2>
            {url ?

                <button className="px-3 py-2 rounded-md bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                    onClick={backOldPage}
                ><Back /></button>
                : false}

            {logoutButton ? 
            <button className="px-3 py-2 rounded-md bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                onClick={logout}
            ><ArrowRight /></button>
                : false}
        </nav>
    );
};