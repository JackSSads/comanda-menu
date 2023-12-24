import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import toast, { Toaster } from "react-hot-toast";

import { LoginService } from "../../service/login/LoginService";

export const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const handleInput = (input, e) => {
        if (input === "email") {
            setEmail(e.target.value);
        } else if (input === "pass") {
            setPass(e.target.value);
        };
    };

    const checkData = async () => {
        const data = { email, pass, };

        if (data.email === "" || data.pass === "") {
            return toast.error("Preencha todos os campos corretamente!");
        };

        if (data.email && data.pass) {

            try {
                const dataLogin = {
                    email: data.email,
                    pass: data.pass,
                };

                await LoginService.login(dataLogin)
                    .then(res => {
                        if (res.status) {
                            setEmail("");
                            setPass("");
                            navigate(`/${res.func}/comandas`);
                        } else {
                            toast.error("Email ou senha incorretos!");
                        };
                    });

            } catch (error) {
                toast.error("Ocorreu um erro inesperado!");
            };

        } else {
            toast.error("Email ou senha incorretos!");
        };
    };

    return (
        <div className="h-full w-full">
            <Navbar title="Comandas Ada Up Soft" />
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
                            value={email}
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
                            value={pass}
                        />
                    </label>
                </div>

                <button className="w-[250px] font-semibold p-3 rounded-xl text-white bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26]"
                    onClick={() => checkData()}
                >LOGIN</button>
            </div>
        </div>
    );
};