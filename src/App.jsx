import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./components/DashboardLayout";
import Kanban from "./components/Kanban";

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState("login");

    // Restore session + listen for auth changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    email: session.user.email,
                    role: session.user.user_metadata?.role || "team",
                    full_name: session.user.user_metadata?.full_name || "",
                    id: session.user.id,
                });
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_IN" && session?.user) {
                    setUser({
                        email: session.user.email,
                        role: session.user.user_metadata?.role || "team",
                        full_name: session.user.user_metadata?.full_name || "",
                        id: session.user.id,
                    });
                }
                if (event === "SIGNED_OUT") setUser(null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setPage("login");
    };

    // Loading screen
    if (loading) {
        return (
            <div style={loadingScreen}>
                <div style={loadingSpinner} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Loading...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Auth screens
    if (!user) {
        if (page === "signup") return <Signup onSwitch={() => setPage("login")} />;
        return <Login setUser={setUser} onSwitch={() => setPage("signup")} />;
    }

    // Dashboard — same view for all roles (everyone can add/move/delete tasks)
    return (
        <DashboardLayout user={user} handleLogout={handleLogout}>
            <Kanban user={user} />
        </DashboardLayout>
    );
}

const loadingScreen = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    background: "#0e1117",
};

const loadingSpinner = {
    width: 24,
    height: 24,
    border: "2px solid rgba(255,255,255,0.1)",
    borderTopColor: "#26786f",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
};
