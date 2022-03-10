import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import DataGeniusProvider from "./DataGeniusContext";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <DataGeniusProvider>
    <App/>
    </DataGeniusProvider>
  </StrictMode>,
  rootElement
);