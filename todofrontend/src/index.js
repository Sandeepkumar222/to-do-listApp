import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import DataProvider from "./context/DataProvider";

ReactDOM.render(
  <BrowserRouter>
    <ChakraProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ChakraProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
