import { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "./AddTask";

export default function Kanban({ user }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadTasks();
    }, []);

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

    const moveTask = async (id, status) => {
        if (user.role === "client") return;

        try {
            await axios.put("/api/tasks", { id, status });
            loadTasks();
        } catch {
            alert("Update failed");
        }
    };

    const columnStyle = {
        flex: 1,
        padding: 16,
        borderRadius: 18,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        minHeight: "70vh"
    };

    const cardStyle = {
        background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        padding: 14,
        marginBottom: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
    };

    const buttonStyle = {
        padding: "6px 10px",
        borderRadius: 8,
        border: "none",
        marginRight: 6,
        background: "linear-gradient(135deg,#22c55e,#4ade80)",
        color: "#022c22",
        fontWeight: 600,
        cursor: "pointer"
    };

    const column = (status, title) => (
        <div style={columnStyle}>
            <h3 style={{
                marginBottom: 18,
                letterSpacing: 1,
                color: "#4ade80"
            }}>
                {title}
            </h3>

            {tasks
                .filter(t => t.status === status)
                .map(t => (
                    <div key={t._id} style={cardStyle}>
                        <div style={{ fontWeight: 700, marginBottom: 6 }}>
                            {t.taskId} — {t.title}
                        </div>

                        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>
                            {t.description}
                        </div>

                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                            <b>Team:</b>{" "}
                            {Array.isArray(t.assignedTo)
                                ? t.assignedTo.join(", ")
                                : t.assignedTo}
                        </div>

                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                            <b>Client:</b> {t.client}
                        </div>

                        <div style={{ fontSize: 12, marginBottom: 10 }}>
                            <b>Deadline:</b> {t.deadline}
                        </div>

                        {user.role !== "client" && (
                            <div>
                                <button style={buttonStyle} onClick={() => moveTask(t._id, "todo")}>
                                    Todo
                                </button>

                                <button style={buttonStyle} onClick={() => moveTask(t._id, "progress")}>
                                    Progress
                                </button>

                                <button style={buttonStyle} onClick={() => moveTask(t._id, "done")}>
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );

    return (
        <div style={{ padding: 30 }}>
            {user.role === "owner" && (
                <div style={{ marginBottom: 30 }}>
                    <AddTask onCreated={loadTasks} />
                </div>
            )}

            <div style={{
                display: "flex",
                gap: 20
            }}>
                {column("todo", "TODO")}
                {column("progress", "IN PROGRESS")}
                {column("done", "COMPLETED")}
            </div>
        </div>
    );
}
