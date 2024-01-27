import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import toast, { Toaster } from "react-hot-toast";

import { LoginService } from "../../service/login/LoginService";

export const Login = () => {

    const navigate = useNavigate();

    const [value, setValue] = useState({
        email: "",
        pass: ""
    });

    const handleInput = (onChange, e) => {
        switch (onChange) {
            case "email":
                setValue(prev => ({ ...prev, email: e.target.value }))
                break;

            case "pass":
                setValue(prev => ({ ...prev, pass: e.target.value }))
                break;

            default: return;
        };
    };

    const login = async () => {

        if (value.email === "" || value.pass === "") {
            return toast.error("Preencha todos os campos corretamente!");
        };

        try {

            await LoginService.login(value)
                .then(res => {

                    if (res.status) {
                        setValue({
                            email: "",
                            pass: ""
                        });

                        if (res.func === "barmen" || res.func === "cozinha") {
                            navigate(`/${res.func}/producao`);
                            return;
                        };

                        if (res.func === "admin") {
                            navigate(`/admin`);
                            return;
                        };

                        navigate(`/${res.func}/comandas`);
                    } else {
                        toast.error("Email ou senha incorretos!");
                    };
                });

        } catch (error) {
            toast.error("Ocorreu um erro inesperado!");
        };
    };

    return (
        <div className="h-full w-full">
            <Navbar title="Dunas Comandas" />
            <div className="h-full flex justify-center items-center flex-col">
                <Toaster />
                <div className="mb-4">
                    <label className="text-slate-700 text-sm font-bold mb-2">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="E-mail"
                            onChange={(e) => handleInput("email", e)}
                            value={value.email}
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label className="text-slate-700 text-sm font-bold mb-2">
                        <input
                            type="password"
                            id="pass"
                            name="pass"
                            className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Senha"
                            onChange={(e) => handleInput("pass", e)}
                            value={value.pass}
                        />
                    </label>
                </div>

                <button className="w-[250px] font-semibold p-3 rounded-xl text-white bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] uppercase"
                    onClick={() => login()}
                >Login</button>
            </div>
        </div>
    );
};
