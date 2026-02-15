import { useState } from "react";
import axios from "axios";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const res = await axios.post("/api/auth", {
                email,
                password
            });

            setUser(res.data);

        } catch {
            alert("Wrong credentials");
        }
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
