export default function Sidebar({ user, setUser }) {
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div style={{
            width: 220,
            height: "100vh",
            background: "#111",
            color: "white",
            padding: 20,
            boxSizing: "border-box"
        }}>
            <h2>Dashboard</h2>

            <p style={{ opacity: 0.7 }}>
                {user.role.toUpperCase()}
            </p>

            <hr />

            <div style={{ marginTop: 20 }}>
                <p>Home</p>
                <p>Tasks</p>
                <p>Progress</p>

                {user.role === "owner" && (
                    <>
                        <p>Assign Tasks</p>
                        <p>Team Overview</p>
                    </>
                )}

                {user.role === "client" && (
                    <>
                        <p>Project Status</p>
                    </>
                )}
            </div>

            <button
                onClick={logout}
                style={{
                    marginTop: 40,
                    padding: 10,
                    width: "100%",
                    background: "red",
                    border: "none",
                    color: "white",
                    cursor: "pointer"
                }}
            >
                Logout
            </button>
        </div>
    );
}
