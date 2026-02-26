import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./supabase"; // Initialize Supabase client & connection test
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
