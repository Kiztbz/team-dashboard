import { useState } from "react";
import axios from "axios";

export default function AddTask({ onCreated }) {
    const [title, setTitle] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [client, setClient] = useState("");
    const [loading, setLoading] = useState(false);

    const createTask = async () => {
        if (!title) return alert("Task title required");

        try {
            setLoading(true);

            await axios.post("/api/tasks", {
                title,
                assignedTo,
                client,
                status: "todo"
            });

            setTitle("");
            setAssignedTo("");
            setClient("");

            onCreated(); // refresh kanban
        } catch (err) {
            alert("Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
            marginBottom: 20
        }}>
            <h3>Create Task</h3>

            <input
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <br /><br />

            <input
                placeholder="Assign to (team email)"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
            />
            <br /><br />

            <input
                placeholder="Client email"
                value={client}
                onChange={(e) => setClient(e.target.value)}
            />
            <br /><br />

            <button onClick={createTask} disabled={loading}>
                {loading ? "Creating..." : "Add Task"}
            </button>
        </div>
    );
}
