import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const res = await axios.post("/api/auth", {
            email,
            password
        });

        const data = res.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "owner") window.location = "/owner";
        if (data.user.role === "admin") window.location = "/admin";
        if (data.user.role === "team_member") window.location = "/team";
        if (data.user.role === "client") window.location = "/client";
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>Login</h2>

            <input
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
            />
            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
            />
            <br /><br />

            <button onClick={login}>Login</button>
        </div>
    );
}
