import {createContext, useCallback, useContext, useState } from "react";

const CloseTicketContext = createContext();

export const CloseTicketProvider = ({ children }) => {

    const [ finalValue, setFinalValue] = useState(0);
    const [ listData, setListData ] = useState([]);
    
    const toggleFinalValue = useCallback((value, data) => {
        setListData(data);
        setFinalValue(value);
    }, []);

    return (
        <CloseTicketContext.Provider value={{ finalValue, listData, toggleFinalValue}}>
            {children}
        </CloseTicketContext.Provider>
    );
};

export const useCloseTicket = () => {
    return useContext(CloseTicketContext);
};