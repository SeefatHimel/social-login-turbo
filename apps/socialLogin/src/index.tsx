import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import App from "./App";
import Login from "./components/login";
import Logout from "./components/logout";
import Home from "./components/home";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <App />
      <Routes>
        <Route index path="/login" element={<Login />} />
        <Route index path="/logout" element={<Logout />} />
        <Route index path="/home" element={<Home />} />
        <Route index path="/" element={<Home />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
