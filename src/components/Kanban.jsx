import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "./AddTask";

export default function Kanban({ user }) {
    const [tasks, setTasks] = useState([]);

    // LOAD TASKS
    const loadTasks = async () => {
        try {
            const res = await axios.get("/api/tasks", {
                params: { role: user.role, email: user.email }
            });

            setTasks(Array.isArray(res.data) ? res.data : []);
        } catch {
            setTasks([]);
        }
    };

    // INITIAL LOAD + AUTO SYNC
    useEffect(() => {
        loadTasks();

        const interval = setInterval(() => {
            loadTasks();
        }, 4000); // refresh every 4 sec

        return () => clearInterval(interval);
    }, []);

    // INSTANT MOVE + BACKEND UPDATE
    const moveTask = async (id, status) => {
        if (user.role === "client") return;

        // instant UI update
        setTasks(prev =>
            prev.map(t =>
                t._id === id ? { ...t, status } : t
            )
        );

        try {
            await axios.put("/api/tasks", { id, status });
        } catch {
            alert("Update failed");
            loadTasks(); // revert if needed
        }
    };

    // LAYOUT STYLES
    const boardStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16
    };

    const columnStyle = {
        padding: 14,
        borderRadius: 16,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        minHeight: "65vh"
    };

    const cardStyle = {
        background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        padding: 14,
        marginBottom: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.4)"
    };

    const buttonStyle = {
        padding: "8px 12px",
        borderRadius: 8,
        border: "none",
        marginTop: 6,
        width: "100%",
        background: "linear-gradient(135deg,#22c55e,#4ade80)",
        color: "#022c22",
        fontWeight: 600,
        cursor: "pointer"
    };

    const column = (status, title) => (
        <div style={columnStyle}>
            <h3 style={{ marginBottom: 18, color: "#4ade80" }}>
                {title}
            </h3>

            {tasks
                .filter(t => t.status === status)
                .map(t => (
                    <div key={t._id} style={cardStyle}>
                        <div style={{ fontWeight: 700 }}>
                            {t.taskId} — {t.title}
                        </div>

                        <div style={{ fontSize: 13, opacity: 0.8, margin: "8px 0" }}>
                            {t.description}
                        </div>

                        <div style={{ fontSize: 12 }}>
                            <b>Team:</b>{" "}
                            {Array.isArray(t.assignedTo)
                                ? t.assignedTo.join(", ")
                                : t.assignedTo}
                        </div>

                        <div style={{ fontSize: 12 }}>
                            <b>Client:</b> {t.client}
                        </div>

                        <div style={{ fontSize: 12, marginBottom: 10 }}>
                            <b>Deadline:</b> {t.deadline}
                        </div>

                        {user.role !== "client" && (
                            <>
                                <button style={buttonStyle} onClick={() => moveTask(t._id, "todo")}>
                                    Move to Todo
                                </button>

                                <button style={buttonStyle} onClick={() => moveTask(t._id, "progress")}>
                                    Move to Progress
                                </button>

                                <button style={buttonStyle} onClick={() => moveTask(t._id, "done")}>
                                    Move to Done
                                </button>
                            </>
                        )}
                    </div>
                ))}
        </div>
    );

    return (
        <div style={{ padding: 20 }}>
            {/* OWNER TASK CREATION */}
            {user.role === "owner" && (
                <div style={{ marginBottom: 24 }}>
                    <AddTask onCreated={loadTasks} />
                </div>
            )}

            {/* BOARD */}
            <div style={boardStyle}>
                {column("todo", "TODO")}
                {column("progress", "IN PROGRESS")}
                {column("done", "COMPLETED")}
            </div>
        </div>
    );
}
