import Login from "./pages/Login";
import Owner from "./pages/Owner";
import Admin from "./pages/Admin";
import Team from "./pages/Team";
import Client from "./pages/Client";

function HomeRouter() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");

    if (role === "owner") return <Owner />;
    if (role === "admin") return <Admin />;
    if (role === "team_member") return <Team />;
    if (role === "client") return <Client />;

    return <Login />;
}

export default function App() {
    return <HomeRouter />;
}
