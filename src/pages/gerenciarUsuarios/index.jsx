import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Plus } from "../../libs/icons";
import { Navbar } from "../../components";
import { Delete, Edit } from "../../libs/icons";
import { UsuarioService } from "../../service/usuario/UsuarioService";

export const GerenciarUsuarios = () => {

    const [func, setFunc] = useState("garcom");
    const [pass, setPass] = useState("");
    const [email, setEmail] = useState("");
    const [nameUser, setNameUser] = useState("");
    const [id, setId] = useState("");

    const [listUser, setListUser] = useState([]);

    const [action, setAction] = useState("create");

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = useCallback(() => {
        try {
            UsuarioService.getAll()
                .then((result) => {
                    setListUser(result.data);
                })
                .catch(() => { return });
        } catch (error) {

        };
    }, []);

    const handleInput = (e, action) => {
        if (action === "func") {
            setFunc(e);
        } else if (action === "pass") {
            setPass(e);
        } else if (action === "email") {
            setEmail(e);
        } else if (action === "nameUser") {
            setNameUser(e);
        };
    };

    const user = () => {
        if (action === "create") {

            if (nameUser === "" || email === "" || pass === "" | func === "") {
                return toast.error("Preencha todos os campos!");
            };

            const data = {
                nameUser,
                email,
                pass,
                func
            };

            try {
                UsuarioService.create(data)
                    .then((result) => {
                        toast.success(`${result.message}`);
                        getAllUsers();
                    });

                setFunc("");
                setPass("");
                setEmail("");
                setNameUser("");

            } catch (error) {
                return toast.error("Erro ao consultar o Banco de Dados");
            };
        } else if (action === "edit") {

            if (nameUser === "" || email === "" || pass === "" | func === "") {
                return toast.error("Preencha todos os campos!");
            };

            const data = {
                nameUser,
                email,
                pass,
                func
            };

            try {
                UsuarioService.updateById(id, data)
                    .then((result) => {
                        toast.success(`${result.message}`);
                        getAllUsers();
                    });

                setFunc("");
                setPass("");
                setEmail("");
                setNameUser("");
                setAction("create");

            } catch (error) {
                return toast.error("Erro ao consultar o Banco de Dados");
            };
        };
    };

    const loadUser = (_id) => {
        try {
            UsuarioService.getById(_id)
                .then((result) => {
                    setAction("edit");
                    setId(result.data._id);
                    setFunc(result.data.func);
                    setEmail(result.data.email);
                    setNameUser(result.data.nameUser);
                });
        } catch (error) {
            return toast.error("Erro ao consultar o Banco de Dados");
        };
    };

    const deleteUser = (_id) => {
        try {
            UsuarioService.deleteById(_id)
                .then((result) => {
                    toast.success(`${result.message}`);
                });
        } catch (error) {
            toast.error("Erro ao consultar o Banco de Dados");
        };
    };

    return (
        <>
            <Navbar title={"Cadastro de produtos"} url={"/admin"} />
            <div className="mx-10 flex justify-center items-center flex-col gap-5">
                <Toaster />
                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="text"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Nome de usuário"
                        onChange={(e) => handleInput(e.target.value, "nameUser")}
                        value={nameUser}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="email"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="E-mail"
                        onChange={(e) => handleInput(e.target.value, "email")}
                        value={email}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="password"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Senha"
                        onChange={(e) => handleInput(e.target.value, "pass")}
                        value={pass}
                    />
                </label>

                <label className="flex flex-col text-slate-900 font-semibold">
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={func}
                        name="func"
                        onChange={(e) => handleInput(e.target.value, "func")}>
                        <option value={`garcom`} >Garçom</option>
                        <option value={`barmen`} >Barmen</option>
                        <option value={`churrasqueiro`} >Churrasqueiro</option>
                    </select>
                </label>

                <button className="flex gap-1 justify-center w-[250px] p-3 font-semibold text-[#1C1D26] rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                    onClick={() => user()}
                ><Plus /> {action === "create" ? "Cadastrar usuário" : "Atualizar usuário"}</button>


                <div className="flex flex-col gap-5 mt-10">
                    <h2 className="w-full text-center pl-2 border-l-2 border-[#1C1D26] text-[#1C1D26] font-semibold">Todos os usuários</h2>
                    {listUser.map((e) => (
                        <div key={e._id} className="flex flex-col gap-2 px-5 py-7 rounded-md shadow-xl bg-[#1C1D26]">
                            <h3 className="text-slate-300 font-bold flex flex-col rounded-xl bg-slate-800 px-5">Usuário: <span className="text-slate-500">{e.nameUser}</span></h3>
                            <h3 className="text-slate-300 font-bold flex flex-col rounded-xl bg-slate-800 px-5">E-mail: <span className="text-slate-500">{e.email}</span></h3>
                            <h3 className="text-slate-300 font-bold flex flex-col rounded-xl bg-slate-800 px-5">Função: <span className="text-slate-500">{e.func}</span></h3>

                            <div className="flex self-center gap-10 mt-5">
                                <button
                                    className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                    onClick={() => {
                                        loadUser(e._id);
                                    }}
                                ><Edit /></button>

                                <button
                                    className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                    onClick={() => deleteUser(e._id)}
                                ><Delete /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};