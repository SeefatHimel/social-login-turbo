import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import App from "./App";
import Login from "./components/login";
import Logout from "./components/logout";
import Home from "./components/home";
import Registration from "./components/registration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <App />
      <ToastContainer
        enableMultiContainer
        theme="colored"
        containerId={"top-right"}
        position="top-right"
        autoClose={5000}
      />
      <Routes>
        <Route index path="/login" element={<Login />} />
        <Route index path="/registration" element={<Registration />} />
        <Route index path="/logout" element={<Logout />} />
        <Route index path="/home" element={<Home />} />
        <Route index path="/" element={<Home />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
