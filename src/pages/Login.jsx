import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(true);

    const login = async () => {
        if (!email || !password) return alert("Enter credentials");

        try {
            setLoading(true);

            const res = await axios.post("/api/login", {
                email,
                password
            });

            const user = res.data;

            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

        } catch {
            alert("Invalid login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showLoader && <Loader onFinish={() => setShowLoader(false)} />}

            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#020617,#0f172a)"
            }}>
                <div style={{
                    width: 380,
                    padding: 30,
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
                }}>
                    <h2 style={{
                        marginBottom: 20,
                        color: "#4ade80",
                        letterSpacing: 1
                    }}>
                        Developer Portal
                    </h2>

                    <p style={{
                        fontSize: 13,
                        opacity: .7,
                        marginBottom: 20
                    }}>
                        Track work. Build faster. Ship better.
                    </p>

                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />

                    <button onClick={login} style={buttonStyle}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
            </div>
        </>
    );
}

const inputStyle = {
    width: "100%",
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none"
};

const buttonStyle = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#22c55e,#4ade80)",
    color: "#022c22",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8
};
