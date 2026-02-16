import { useEffect, useState } from "react";
import axios from "axios";

export default function Kanban({ user }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const res = await axios.get("/api/tasks", {
            params: {
                role: user.role,
                email: user.email
            }
        });
        if (!Array.isArray(tasks)) return <div>Loading tasks...</div>;
        setTasks(Array.isArray(res.data) ? res.data : []);
    };

    const moveTask = async (id, status) => {
        if (user.role === "client") return;
        await axios.put("/api/tasks", { id, status });
        loadTasks();
    };

    const createTask = async () => {
        if (user.role !== "owner") return;

        const title = prompt("Task title");
        const assignedTo = prompt("Team email");
        const client = prompt("Client email");

        await axios.post("/api/tasks", {
            title,
            assignedTo,
            client,
            status: "todo"
        });

        loadTasks();
    };

    return (
        <div>
            <h3>Tasks</h3>

            {user.role === "owner" && (
                <button onClick={createTask}>+ Add Task</button>
            )}

            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
                {["todo", "progress", "done"].map((status) => (
                    <div key={status} style={{ flex: 1 }}>
                        <h4>{status.toUpperCase()}</h4>

                        {tasks
                            .filter((t) => t.status === status)
                            .map((t) => (
                                <div
                                    key={t._id}
                                    style={{
                                        background: "#fff",
                                        padding: 10,
                                        marginBottom: 10,
                                        borderRadius: 6,
                                        boxShadow: "0 0 4px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    <b>{t.title}</b>
                                    <p>Team: {t.assignedTo}</p>
                                    <p>Client: {t.client}</p>

                                    {user.role !== "client" && (
                                        <div>
                                            <button onClick={() => moveTask(t._id, "todo")}>Todo</button>
                                            <button onClick={() => moveTask(t._id, "progress")}>Progress</button>
                                            <button onClick={() => moveTask(t._id, "done")}>Done</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
