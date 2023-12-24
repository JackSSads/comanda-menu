export const LayoutBase = ({ children }) => {
    return (
        <>
            <div className="min-h-[100vh] pt-[75px] flex justify-center items-center">
                {children}
            </div>
        </>
    ); 
};
