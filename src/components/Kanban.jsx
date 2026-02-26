import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import AddTask from "./AddTask";

export default function Kanban({ user }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddTask, setShowAddTask] = useState(false);

    const loadTasks = async () => {
        try {
            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Failed to load tasks:", error);
                setTasks([]);
            } else {
                setTasks(data || []);
            }
        } catch (err) {
            console.error("Load tasks error:", err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();

        const channel = supabase
            .channel("tasks-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, (payload) => {
                console.log("🔄 Realtime:", payload.eventType);
                loadTasks();
            })
            .subscribe((status) => {
                console.log("📡 Realtime status:", status);
            });

        const interval = setInterval(loadTasks, 5000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, []);

    const moveTask = async (id, newStatus) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
        if (error) { console.error("Update failed:", error); loadTasks(); }
    };

    const deleteTask = async (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) { console.error("Delete failed:", error); loadTasks(); }
    };

    const getColumnTasks = (status) => tasks.filter(t => t.status === status);
    const totalTasks = tasks.length;

    const statusOptions = [
        { key: "todo", label: "Todo", icon: "📋" },
        { key: "progress", label: "Progress", icon: "🔄" },
        { key: "done", label: "Done", icon: "✅" },
    ];

    const column = (status, title, icon, accent) => (
        <div className="kanban-col">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 12, color: "rgba(255,255,255,0.8)", letterSpacing: 0.5, textTransform: "uppercase" }}>
                        {title}
                    </span>
                </div>
                <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                    background: `${accent}18`, color: accent, minWidth: 20, textAlign: "center",
                }}>
                    {getColumnTasks(status).length}
                </span>
            </div>

            <div style={{ height: 2, background: `linear-gradient(90deg, ${accent}66, transparent)`, borderRadius: 1, marginBottom: 12 }} />

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {getColumnTasks(status).length === 0 && (
                    <div style={{ padding: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.15)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 18, opacity: 0.3 }}>{icon}</span>
                        <span>No tasks</span>
                    </div>
                )}

                {getColumnTasks(status).map(t => (
                    <div key={t.id} className="task-card">
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={taskIdStyle}>{t.task_id}</span>
                            <button onClick={() => deleteTask(t.id)} className="del-btn" title="Delete">✕</button>
                        </div>

                        <div style={{ fontWeight: 600, fontSize: 13, color: "#e6edf3", marginBottom: 4, lineHeight: 1.4 }}>{t.title}</div>

                        {t.description && (
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10, lineHeight: 1.5 }}>{t.description}</div>
                        )}

                        {/* Meta tags */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                            {t.assigned_to?.length > 0 && <span style={metaStyle}>👥 {t.assigned_to.join(", ")}</span>}
                            {t.client && <span style={metaStyle}>🏢 {t.client}</span>}
                            {t.deadline && <span style={metaStyle}>📅 {t.deadline}</span>}
                        </div>

                        {/* Move buttons */}
                        <div className="move-btns">
                            {statusOptions.filter(s => s.key !== status).map(s => (
                                <button key={s.key} onClick={() => moveTask(t.id, s.key)}>
                                    {s.icon} {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="dash-header">
                <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#e6edf3" }}>Task Board</h2>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                        {totalTasks} task{totalTasks !== 1 ? "s" : ""} across {statusOptions.length} columns
                    </p>
                </div>
                <button id="toggle-add-task" onClick={() => setShowAddTask(!showAddTask)} style={newTaskBtn}>
                    {showAddTask ? "✕ Close" : "+ New Task"}
                </button>
            </div>

            {showAddTask && (
                <div style={{ marginBottom: 16 }}>
                    <AddTask onCreated={loadTasks} />
                </div>
            )}

            {loading && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 60, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    <div style={spinnerStyle} /> Loading tasks...
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {!loading && (
                <div className="kanban-board">
                    {column("todo", "To Do", "📋", "#eab308")}
                    {column("progress", "In Progress", "🔄", "#3b82f6")}
                    {column("done", "Completed", "✅", "#22c55e")}
                </div>
            )}
        </div>
    );
}

const taskIdStyle = {
    fontSize: 10, fontWeight: 700, color: "#26786f",
    background: "rgba(38,120,111,0.12)", padding: "2px 7px",
    borderRadius: 4, letterSpacing: 0.5, fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
};

const metaStyle = {
    fontSize: 10, color: "rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
    padding: "2px 8px", borderRadius: 4,
};

const newTaskBtn = {
    padding: "8px 18px", borderRadius: 6, border: "none",
    background: "#26786f", color: "white", fontWeight: 600,
    fontSize: 12, cursor: "pointer", transition: "background 0.15s",
    whiteSpace: "nowrap",
};

const spinnerStyle = {
    width: 18, height: 18, border: "2px solid rgba(255,255,255,0.1)",
    borderTopColor: "#26786f", borderRadius: "50%", animation: "spin 0.7s linear infinite",
};
