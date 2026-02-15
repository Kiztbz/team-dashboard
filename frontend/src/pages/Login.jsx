import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const res = await axios.post("/api/auth", {
                email,
                password
            });

            const data = res.data;

            // store auth
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // SIMPLE redirect (no route complexity)
            window.location.href = `/?role=${data.user.role}`;

        } catch (err) {
            alert("Login failed");
            console.error(err);
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
