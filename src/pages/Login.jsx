import { useState } from "react";
import { supabase } from "../supabase";
import Loader from "../components/Loader";

export default function Login({ setUser, onSwitch }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [error, setError] = useState(null);

    const login = async () => {
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            // Build user object compatible with the rest of the app
            const user = {
                email: data.user.email,
                role: data.user.user_metadata?.role || "team",
                full_name: data.user.user_metadata?.full_name || "",
                id: data.user.id,
            };

            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") login();
    };

    return (
        <>
            {showLoader && <Loader onFinish={() => setShowLoader(false)} />}

            <div style={pageStyle}>
                <div style={ambientGlow} />

                <div style={cardStyle}>
                    <div style={topBar} />

                    <h2 style={headingStyle}>
                        Developer Portal
                    </h2>

                    <p style={subtitleStyle}>
                        Track work. Build faster. Ship better.
                    </p>

                    {error && (
                        <div style={errorBanner}>
                            <span style={{ marginRight: 8 }}>⚠</span>
                            {error}
                        </div>
                    )}

                    <input
                        id="login-email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                    />

                    <input
                        id="login-password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, inputBlurStyle)}
                    />

                    <button
                        id="login-button"
                        onClick={login}
                        disabled={loading}
                        style={{
                            ...buttonStyle,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 8px 25px rgba(38,120,111,0.5)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p style={switchText}>
                        Don't have an account?{" "}
                        <span
                            id="switch-to-signup"
                            onClick={onSwitch}
                            style={switchLink}
                            onMouseEnter={(e) => (e.target.style.color = "#5eead4")}
                            onMouseLeave={(e) => (e.target.style.color = "#26786f")}
                        >
                            Create Account
                        </span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes loginFadeIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
                    50%      { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
                }
            `}</style>
        </>
    );
}

const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    position: "relative",
    overflow: "hidden",
};

const ambientGlow = {
    position: "absolute",
    top: "30%",
    left: "50%",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(38,120,111,0.15), transparent 70%)",
    animation: "glowPulse 4s ease-in-out infinite",
    pointerEvents: "none",
};

const cardStyle = {
    width: 380,
    padding: "36px 32px 28px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    position: "relative",
    zIndex: 1,
    animation: "loginFadeIn 0.5s ease-out",
    overflow: "hidden",
};

const topBar = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, transparent, #26786f, #4ade80, #26786f, transparent)",
    backgroundSize: "200% auto",
    animation: "shimmer 3s linear infinite",
};

const headingStyle = {
    marginBottom: 8,
    color: "white",
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 0.5,
};

const subtitleStyle = {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 24,
    marginTop: 0,
};

const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
};

const inputFocusStyle = {
    borderColor: "rgba(38,120,111,0.6)",
    boxShadow: "0 0 0 3px rgba(38,120,111,0.15)",
};

const inputBlurStyle = {
    borderColor: "rgba(255,255,255,0.08)",
    boxShadow: "none",
};

const buttonStyle = {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #26786f, #2a8a7e)",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: 0.5,
    cursor: "pointer",
    marginTop: 8,
    transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
};

const switchText = {
    textAlign: "center",
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    marginTop: 20,
    marginBottom: 0,
};

const switchLink = {
    color: "#26786f",
    fontWeight: 600,
    cursor: "pointer",
    transition: "color 0.2s",
};

const errorBanner = {
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171",
};
