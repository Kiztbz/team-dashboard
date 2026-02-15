import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        try {
            setLoading(true);

            const res = await axios.post("/api/auth", {
                email,
                password
            });

            const data = res.data;

            // store token ONLY
            localStorage.setItem("token", data.token);

            // reload app → App.jsx will verify token from backend
            window.location.reload();

        } catch (err) {
            alert("Invalid email or password");
            console.error(err);
        } finally {
            setLoading(false);
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

            <button onClick={login} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}
