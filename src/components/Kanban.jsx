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
                params: {
                    role: user.role,
                    email: user.email
                }
            });

            // SAFETY: ensure array
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
            alert("Failed to update task");
        }
    };

    const column = (status, title) => (
        <div style={{ flex: 1, padding: 10 }}>
            <h3>{title}</h3>

            {tasks
                .filter(t => t.status === status)
                .map(t => (
                    <div
                        key={t._id}
                        style={{
                            background: "#fff",
                            padding: 12,
                            marginBottom: 10,
                            borderRadius: 8,
                            boxShadow: "0 0 4px rgba(0,0,0,0.1)"
                        }}
                    >
                        <b>{t.title}</b>

                        {/* MULTI TEAM DISPLAY */}
                        <p>
                            Team: {Array.isArray(t.assignedTo)
                                ? t.assignedTo.join(", ")
                                : t.assignedTo}
                        </p>

                        <p>Client: {t.client}</p>

                        {user.role !== "client" && (
                            <div style={{ marginTop: 8 }}>
                                <button onClick={() => moveTask(t._id, "todo")}>Todo</button>
                                <button onClick={() => moveTask(t._id, "progress")}>Progress</button>
                                <button onClick={() => moveTask(t._id, "done")}>Done</button>
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );

    return (
        <div>
            {/* Only owner can create tasks */}
            {user.role === "owner" && (
                <AddTask onCreated={loadTasks} />
            )}

            <div style={{
                display: "flex",
                gap: 20,
                marginTop: 20
            }}>
                {column("todo", "Todo")}
                {column("progress", "In Progress")}
                {column("done", "Done")}
            </div>
        </div>
    );
}
