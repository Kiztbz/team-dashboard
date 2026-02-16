import { useState } from "react";

export default function Sidebar({ user, setUser }) {
    const [active, setActive] = useState("Home");

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const navItem = (label) => (
        <div
            onClick={() => setActive(label)}
            style={{
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 6,
                cursor: "pointer",
                background:
                    active === label
                        ? "linear-gradient(135deg,#22c55e,#4ade80)"
                        : "transparent",
                color: active === label ? "#022c22" : "white",
                fontWeight: active === label ? 700 : 500,
                transition: "0.2s"
            }}
        >
            {label}
        </div>
    );

    return (
        <div style={sidebarStyle}>
            {/* LOGO / TITLE */}
            <div style={{ marginBottom: 30 }}>
                <div style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#4ade80",
                    letterSpacing: 1
                }}>
                    TEAM OPS
                </div>

                <div style={{
                    fontSize: 12,
                    opacity: .6,
                    marginTop: 4
                }}>
                    {user.role.toUpperCase()}
                </div>
            </div>

            {/* NAV */}
            <div>
                {navItem("Home")}
                {navItem("Tasks")}
                {navItem("Progress")}

                {user.role === "owner" && (
                    <>
                        {navItem("Assign Tasks")}
                        {navItem("Team Overview")}
                        {navItem("Reports")}
                    </>
                )}

                {user.role === "team" && (
                    <>
                        {navItem("My Work")}
                        {navItem("Deadlines")}
                    </>
                )}

                {user.role === "client" && (
                    <>
                        {navItem("Project Status")}
                        {navItem("Deliverables")}
                    </>
                )}
            </div>

            {/* FOOTER */}
            <div style={{ marginTop: "auto" }}>
                <button onClick={logout} style={logoutStyle}>
                    Logout
                </button>
            </div>
        </div>
    );
}

const sidebarStyle = {
    width: 240,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    boxSizing: "border-box",
    background: "linear-gradient(180deg,#020617,#0f172a)",
    borderRight: "1px solid rgba(255,255,255,0.05)"
};

const logoutStyle = {
    marginTop: 30,
    padding: 12,
    width: "100%",
    borderRadius: 10,
    border: "none",
    background: "rgba(255,0,0,0.8)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer"
};
