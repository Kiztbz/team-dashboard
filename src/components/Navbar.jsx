export default function Navbar({ user, setUser, children }) {
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const go = (path) => {
        window.location = path;
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "#020617" }}>

            {/* SIDEBAR */}
            <div style={styles.sidebar}>
                <div>
                    <h2 style={styles.logo}>TEAM</h2>
                    <p style={styles.role}>{user.role}</p>

                    <div style={styles.navItem} onClick={() => go("/")}>Dashboard</div>
                    <div style={styles.navItem} onClick={() => go("/kanban")}>Kanban</div>
                    <div style={styles.navItem} onClick={() => go("/tasks")}>Tasks</div>

                    {user.role === "owner" && (
                        <>
                            <div style={styles.navItem} onClick={() => go("/team")}>Team</div>
                            <div style={styles.navItem} onClick={() => go("/clients")}>Clients</div>
                        </>
                    )}

                    {user.role === "team" && (
                        <div style={styles.navItem} onClick={() => go("/my-work")}>My Work</div>
                    )}

                    {user.role === "client" && (
                        <div style={styles.navItem} onClick={() => go("/project")}>Project</div>
                    )}
                </div>

                <button style={styles.logout} onClick={logout}>
                    Logout
                </button>
            </div>


            {/* MAIN AREA */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                {/* TOP BAR */}
                <div style={styles.topbar}>
                    <div style={{ fontWeight: 600 }}>Team Dashboard</div>

                    <input
                        placeholder="Search tasks..."
                        style={styles.search}
                    />

                    <button style={styles.addTask}>+ Task</button>

                    <div style={styles.avatar}>
                        {user.email?.[0]?.toUpperCase()}
                    </div>
                </div>


                {/* PAGE CONTENT */}
                <div style={styles.content}>
                    {children}
                </div>

            </div>
        </div>
    );
}

const styles = {
    sidebar: {
        width: 220,
        background: "#020617",
        color: "white",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #0f172a"
    },

    logo: {
        color: "#4ade80",
        marginBottom: 6
    },

    role: {
        opacity: 0.6,
        marginBottom: 20,
        fontSize: 12
    },

    navItem: {
        padding: "10px 12px",
        borderRadius: 8,
        marginBottom: 6,
        cursor: "pointer",
        background: "transparent"
    },

    logout: {
        padding: 10,
        background: "#ef4444",
        border: "none",
        color: "white",
        borderRadius: 8,
        cursor: "pointer"
    },

    topbar: {
        height: 60,
        background: "#020617",
        borderBottom: "1px solid #0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        color: "white"
    },

    search: {
        width: 260,
        padding: 8,
        borderRadius: 8,
        border: "none"
    },

    addTask: {
        background: "#4ade80",
        border: "none",
        padding: "8px 14px",
        borderRadius: 8,
        cursor: "pointer"
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#4ade80",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        color: "#020617"
    },

    content: {
        padding: 24,
        overflowY: "auto",
        flex: 1,
        background: "#020617"
    }
};
