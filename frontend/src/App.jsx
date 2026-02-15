import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Owner from "./pages/Owner";
import Admin from "./pages/Admin";
import Team from "./pages/Team";
import Client from "./pages/Client";

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get("/api/auth", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data.user);

            } catch (err) {
                // token invalid or expired
                localStorage.removeItem("token");
            }

            setLoading(false);
        };

        verifyUser();
    }, []);

    if (loading) return <h2>Loading...</h2>;

    if (!user) return <Login />;

    if (user.role === "owner") return <Owner />;
    if (user.role === "admin") return <Admin />;
    if (user.role === "team_member") return <Team />;
    if (user.role === "client") return <Client />;
}
