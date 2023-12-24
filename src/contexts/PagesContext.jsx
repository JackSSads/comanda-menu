import { createContext, useContext, useState } from "react";

const PageContext = createContext();

export const PageProvider = ({ children }) => {

    const [currentPage, setCurrentPage] = useState("");
    const [visibilitNewTicket, setVisibilitNewTicket] = useState(false);

    return (
        <PageContext.Provider value={{ currentPage, setCurrentPage, visibilitNewTicket, setVisibilitNewTicket }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePage = () => {
    return useContext(PageContext);
};
