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
        setTasks(res.data);
    };

    const moveTask = async (id, status) => {
        if (user.role === "client") return;

        await axios.put("/api/tasks", { id, status });
        loadTasks();
    };

    const createTask = async () => {
        if (user.role !== "owner") return;

        const title = prompt("Task title");
        const assignedTo = prompt("Assign to team email");
        const client = prompt("Client email");

        await axios.post("/api/tasks", {
            title,
            assignedTo,
            client,
            status: "todo"
        });

        loadTasks();
    };

    const column = (status, title) => (
        <div style={{ flex: 1, padding: 20 }}>
            <h3>{title}</h3>

            {tasks
                .filter((t) => t.status === status)
                .map((t) => (
                    <div
                        key={t._id}
                        style={{
                            background: "#fff",
                            padding: 10,
                            marginBottom: 10,
                            borderRadius: 8,
                            boxShadow: "0 0 5px rgba(0,0,0,0.1)"
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
    );

    return (
        <div style={{ padding: 20 }}>
            <h2>Kanban Board</h2>

            {user.role === "owner" && (
                <button onClick={createTask}>+ Create Task</button>
            )}

            <div style={{ display: "flex", marginTop: 20 }}>
                {column("todo", "Todo")}
                {column("progress", "In Progress")}
                {column("done", "Done")}
            </div>
        </div>
    );
}
