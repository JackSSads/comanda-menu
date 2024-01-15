import { useState } from "react";

import { usePage } from "../../contexts";
import { Close } from "../../libs/icons";
import { ComandaService } from "../../service/comanda/ComandaService";
import socket from "../../service/socket";

export const NovaComanda = () => {

    const [nameClient, setCliente] = useState("");
    const [vessel, setEmbarcacao] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const { visibilitNewTicket, setVisibilitNewTicket } = usePage();

    const handleValue = (data, e) => {
        if (data === "nameClient") {
            setCliente(e.target.value);
        } else if (data === "vessel") {
            setEmbarcacao(e.target.value);
        };
    };

    const createNewTicket = () => {
        if (nameClient === "") {
            setCliente("Nova comanda");
        };

        if (vessel === "") {
            setEmbarcacao("Dunas");
        };

        if (nameClient !== "" && vessel !== "") {
            setButtonDisabled(false);

            const data = {
                nameClient,
                vessel,
                products: [],
                totalValue: 0,
                status: true,
                pagForm: ""
            };

            try {
                ComandaService.create(data)
                    .then((res) => {
                        if (res.status) {
                            socket.emit("nova_comanda", data);
                            setVisibilitNewTicket(false);
                        };
                    });

            } catch (error) {
                return new Error(error);
            };
        };
    };

    return (
        <div className={`h-[80vh] py-3 px-1 flex flex-col justify-center items-center gap-5 ${visibilitNewTicket ? "" : "hidden"}`}>

            <div className="h-[300px] w-[350px] rounded-xl border border-hidden bg-[#1C1D26] py-10 flex flex-col justify-between items-center text-slate-100">

                <div className="flex flex-col items-center gap-3">

                    <label className="w-[270px] text-sm font-bold mb-2 text-slate-400">
                        <input
                            className="text-white bg-transparent border border-[#393636] rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="nameClient"
                            name="nameClient"
                            required
                            placeholder="Nome do cliente"
                            onChange={(e) => handleValue("nameClient", e)}
                            value={nameClient}
                        />
                    </label>

                    <label className="w-[270px] text-sm font-bold mb-2 text-slate-400">
                        <input
                            className="text-white bg-transparent border border-[#393636] rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="indicacao"
                            name="vessel"
                            required
                            placeholder="Observação"
                            onChange={(e) => handleValue("vessel", e)}
                            value={vessel}
                        />
                    </label>
                </div>

                <button onClick={() => createNewTicket()}
                    disabled={buttonDisabled}
                    className="w-[270px] rounded-xl bg-[#EB8F00] text-[#1C1D26] font-semibold p-3 border border-transparent hover:border-[#EB8F00] hover:bg-[#1C1D26] hover:text-white"
                >Cadastrar</button>
            </div>

            <button className="text-white p-2 rounded-md font-semibold bg-[#1C1D26] hover:text-[#1C1D26] hover:bg-[#EB8F00]"
                onClick={() => setVisibilitNewTicket(false)}
            ><Close /></button>

        </div>
    );
};