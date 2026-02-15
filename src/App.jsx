import { useState } from "react";

import Login from "./pages/Login.jsx";
import Owner from "./pages/Owner.jsx";
import Admin from "./pages/Admin.jsx";
import Team from "./pages/Team.jsx";
import Client from "./pages/Client.jsx";

export default function App() {
    const [user, setUser] = useState(null);

    if (!user) return <Login setUser={setUser} />;

    if (user.role === "owner") return <Owner />;
    if (user.role === "admin") return <Admin />;
    if (user.role === "team_member") return <Team />;
    if (user.role === "client") return <Client />;
}
