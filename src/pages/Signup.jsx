import { useState } from "react";
import { supabase } from "../supabase";

export default function Signup({ onSwitch }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("error"); // "error" | "success"

    const handleSignup = async () => {
        // Validation
        if (!fullName.trim() || !email || !password || !confirmPassword) {
            setMessage("Please fill in all fields.");
            setMessageType("error");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            setMessageType("error");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            setMessage(null);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                    },
                },
            });

            if (error) {
                setMessage(error.message);
                setMessageType("error");
                return;
            }

            // Check if email confirmation is required
            if (data?.user?.identities?.length === 0) {
                setMessage("An account with this email already exists.");
                setMessageType("error");
            } else {
                setMessage("Account created! Check your email to confirm.");
                setMessageType("success");
                // Clear form on success
                setFullName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            setMessage("Something went wrong. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSignup();
    };

    return (
        <div style={pageStyle}>
            {/* Ambient glow */}
            <div style={ambientGlow} />

            <div style={cardStyle}>
                {/* Decorative top bar */}
                <div style={topBar} />

                <h2 style={headingStyle}>Create Account</h2>

                <p style={subtitleStyle}>
                    Join the team. Build something great.
                </p>

                {/* Message banner */}
                {message && (
                    <div
                        style={{
                            ...messageBanner,
                            background:
                                messageType === "success"
                                    ? "rgba(34,197,94,0.12)"
                                    : "rgba(239,68,68,0.12)",
                            border:
                                messageType === "success"
                                    ? "1px solid rgba(34,197,94,0.3)"
                                    : "1px solid rgba(239,68,68,0.3)",
                            color:
                                messageType === "success"
                                    ? "#4ade80"
                                    : "#f87171",
                        }}
                    >
                        <span style={{ marginRight: 8 }}>
                            {messageType === "success" ? "✓" : "⚠"}
                        </span>
                        {message}
                    </div>
                )}

                {/* Full Name */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Full Name</label>
                    <input
                        id="signup-fullname"
                        placeholder="e.g. Pragyat Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                        onFocus={(e) =>
                            Object.assign(e.target.style, inputFocusStyle)
                        }
                        onBlur={(e) =>
                            Object.assign(e.target.style, inputBlurStyle)
                        }
                    />
                </div>

                {/* Email */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Email</label>
                    <input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                        onFocus={(e) =>
                            Object.assign(e.target.style, inputFocusStyle)
                        }
                        onBlur={(e) =>
                            Object.assign(e.target.style, inputBlurStyle)
                        }
                    />
                </div>

                {/* Password */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Password</label>
                    <input
                        id="signup-password"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                        onFocus={(e) =>
                            Object.assign(e.target.style, inputFocusStyle)
                        }
                        onBlur={(e) =>
                            Object.assign(e.target.style, inputBlurStyle)
                        }
                    />
                </div>

                {/* Confirm Password */}
                <div style={fieldGroup}>
                    <label style={labelStyle}>Confirm Password</label>
                    <input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                        onFocus={(e) =>
                            Object.assign(e.target.style, inputFocusStyle)
                        }
                        onBlur={(e) =>
                            Object.assign(e.target.style, inputBlurStyle)
                        }
                    />
                </div>

                {/* Password strength hint */}
                {password && (
                    <div style={strengthBar}>
                        <div
                            style={{
                                ...strengthFill,
                                width:
                                    password.length >= 12
                                        ? "100%"
                                        : password.length >= 8
                                            ? "66%"
                                            : password.length >= 6
                                                ? "33%"
                                                : "10%",
                                background:
                                    password.length >= 12
                                        ? "#4ade80"
                                        : password.length >= 8
                                            ? "#26786f"
                                            : password.length >= 6
                                                ? "#eab308"
                                                : "#ef4444",
                            }}
                        />
                    </div>
                )}

                {/* Sign Up button */}
                <button
                    id="signup-button"
                    onClick={handleSignup}
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                                "0 8px 25px rgba(38,120,111,0.5)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                    }}
                >
                    {loading ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <span style={spinnerStyle} />
                            Creating account...
                        </span>
                    ) : (
                        "Create Account"
                    )}
                </button>

                {/* Switch to login */}
                <p style={switchText}>
                    Already have an account?{" "}
                    <span
                        id="switch-to-login"
                        onClick={onSwitch}
                        style={switchLink}
                        onMouseEnter={(e) =>
                            (e.target.style.color = "#5eead4")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.color = "#26786f")
                        }
                    >
                        Sign In
                    </span>
                </p>
            </div>

            {/* Keyframe animations */}
            <style>{`
                @keyframes signupFadeIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
                    50%      { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
                }
            `}</style>
        </div>
    );
}

/* ─── Styles ──────────────────────────────────────────── */

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
    width: 400,
    padding: "36px 32px 28px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    position: "relative",
    zIndex: 1,
    animation: "signupFadeIn 0.5s ease-out",
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

const fieldGroup = {
    marginBottom: 16,
};

const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.45)",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
};

const inputStyle = {
    width: "100%",
    padding: "12px 14px",
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

const strengthBar = {
    height: 3,
    borderRadius: 3,
    background: "rgba(255,255,255,0.06)",
    marginBottom: 20,
    marginTop: -8,
    overflow: "hidden",
};

const strengthFill = {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.4s ease, background 0.4s ease",
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
    marginTop: 4,
    transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
};

const spinnerStyle = {
    display: "inline-block",
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
};

const messageBanner = {
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
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
