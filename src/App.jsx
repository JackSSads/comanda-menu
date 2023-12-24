import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { PageProvider, CloseTicketProvider } from "./contexts";

export const App = () => {
  return (
    <BrowserRouter>
      <PageProvider>
        <CloseTicketProvider>
          <LayoutBase title="comandas" url="comandas">
            <AppRoutes />
          </LayoutBase>
        </CloseTicketProvider>
      </PageProvider>
    </BrowserRouter>
  );
};
