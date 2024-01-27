import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { PageProvider } from "./contexts";

export const App = () => {
  return (
    <BrowserRouter>
      <PageProvider>
        <LayoutBase title="comandas" url="comandas">
          <AppRoutes />
        </LayoutBase>
      </PageProvider>
    </BrowserRouter>
  );
};
