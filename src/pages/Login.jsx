import { useState } from "react";
import axios from "axios";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const res = await axios.post("/api/login", {
                email,
                password
            });

            const user = res.data;

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "owner") window.location = "/owner";
            if (user.role === "team") window.location = "/team";
            if (user.role === "client") window.location = "/client";

        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>Login</h2>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />

            <button onClick={login}>Login</button>
        </div>
    );
}
