import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function DashboardLayout({ user, handleLogout, children }) {
    const [time, setTime] = useState(new Date());
    const [realtimeStatus, setRealtimeStatus] = useState("connecting");

    useEffect(() => {
        const tick = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(tick);
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel("status-check")
            .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => { })
            .subscribe((status) => {
                if (status === "SUBSCRIBED") setRealtimeStatus("connected");
                else if (status === "CLOSED") setRealtimeStatus("disconnected");
                else if (status === "CHANNEL_ERROR") setRealtimeStatus("error");
                else setRealtimeStatus("connecting");
            });
        return () => supabase.removeChannel(channel);
    }, []);

    const statusDot = {
        connected: "#4ade80", connecting: "#eab308",
        disconnected: "#ef4444", error: "#ef4444",
    };

    const formatTime = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const initials = user.full_name
        ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
        : user.email?.[0]?.toUpperCase() || "U";

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

            {/* ═══════ TOP BAR ═══════ */}
            <div className="top-bar">
                {/* Left */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <div style={logoStyle}>◆</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>
                        Folio
                    </span>
                    <div className="hide-mobile" style={sep} />
                    <span className="hide-mobile" style={roleBadge}>
                        {user.role.toUpperCase()}
                    </span>
                </div>

                {/* Center search (desktop only) */}
                <div className="hide-mobile" style={searchStyle}>
                    <span style={{ opacity: 0.4, fontSize: 11 }}>⌘</span>
                    <span style={{ opacity: 0.3, fontSize: 11 }}>Search tasks...</span>
                </div>

                {/* Right */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={chipStyle}>
                        <div style={avatarStyle}>{initials}</div>
                        <span className="hide-mobile" style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user.full_name || user.email}
                        </span>
                    </div>
                    <button onClick={handleLogout} style={logoutStyle} title="Sign out">⏻</button>
                </div>
            </div>

            {/* ═══════ MAIN CONTENT ═══════ */}
            <div className="main-content">
                {children}
            </div>

            {/* ═══════ BOTTOM BAR ═══════ */}
            <div className="bottom-bar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Status dot */}
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 8px", fontSize: 11 }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: statusDot[realtimeStatus],
                            boxShadow: `0 0 5px ${statusDot[realtimeStatus]}`,
                        }} />
                        <span>{realtimeStatus === "connected" ? "Live" : realtimeStatus}</span>
                    </div>
                    <div style={barSep} />
                    <div style={barItem}>👤 {user.role}</div>
                    <div className="hide-mobile" style={barSep} />
                    <div className="hide-mobile" style={barItem}>⎇ main</div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="hide-mobile" style={barItem}>{user.email}</div>
                    <div className="hide-mobile" style={barSep} />
                    <div style={barItem}>🕐 {formatTime(time)}</div>
                </div>
            </div>
        </div>
    );
}

const logoStyle = {
    width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 5, background: "linear-gradient(135deg, #26786f, #4ade80)",
    color: "#020617", fontWeight: 800, fontSize: 10,
};

const sep = { width: 1, height: 14, background: "rgba(255,255,255,0.1)" };

const roleBadge = {
    fontSize: 9, fontWeight: 700, color: "#26786f",
    background: "rgba(38,120,111,0.15)", padding: "2px 7px",
    borderRadius: 4, letterSpacing: 0.8,
};

const searchStyle = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "3px 14px", borderRadius: 5,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
    minWidth: 180, justifyContent: "center", cursor: "pointer",
};

const chipStyle = {
    display: "flex", alignItems: "center", gap: 6,
    padding: "2px 8px 2px 2px", borderRadius: 5,
    background: "rgba(255,255,255,0.04)",
};

const avatarStyle = {
    width: 20, height: 20, borderRadius: 4,
    background: "linear-gradient(135deg, #26786f, #2a8a7e)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 9, fontWeight: 700, color: "white",
};

const logoutStyle = {
    background: "transparent", border: "none",
    color: "rgba(255,255,255,0.4)", fontSize: 15,
    cursor: "pointer", padding: "4px 6px", borderRadius: 4,
};

const barItem = {
    display: "flex", alignItems: "center", gap: 4,
    padding: "0 8px", fontSize: 11,
};

const barSep = { width: 1, height: 12, background: "rgba(255,255,255,0.1)" };
