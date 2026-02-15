import { useState } from "react";

import Login from "./pages/Login";
import Owner from "./pages/Owner";
import Admin from "./pages/Admin";
import Team from "./pages/Team";
import Client from "./pages/Client";

export default function App() {
    const [user, setUser] = useState(null);

    if (!user) return <Login setUser={setUser} />;

    if (user.role === "owner") return <Owner />;
    if (user.role === "admin") return <Admin />;
    if (user.role === "team_member") return <Team />;
    if (user.role === "client") return <Client />;
}
