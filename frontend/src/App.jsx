import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Owner from "./pages/Owner";
import Admin from "./pages/Admin";
import Team from "./pages/Team";
import Client from "./pages/Client";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/owner" element={<Owner />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/team" element={<Team />} />
                <Route path="/client" element={<Client />} />
            </Routes>
        </BrowserRouter>
    );
}
