import { useState } from "react";
import axios from "axios";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("team");

    const login = async () => {
        try {
            const res = await axios.post("/api/login", {
                email,
                password,
                role
            });

            const user = res.data;

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));

            // simple routing
            if (user.role === "owner") window.location = "/owner";
            else if (user.role === "admin") window.location = "/admin";
            else if (user.role === "team") window.location = "/team";
            else if (user.role === "client") window.location = "/client";

        } catch (err) {
            alert("Invalid credentials");
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

            {/* role selector */}
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="team">Team</option>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
            </select>

            <br /><br />

            <button onClick={login}>Login</button>
        </div>
    );
}
