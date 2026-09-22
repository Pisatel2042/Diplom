import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import React from "react"
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
} from "@chakra-ui/react"

import { BrowserRouter } from "react-router-dom"
import { system } from "./theme/system.js"
import Router from "./components/Router.jsx"
import "./index.css"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider value={system}>
          <Router/>
        </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
 
)