import { useState, useEffect } from "react";
import axios from "axios";

export default function AddTask({ onCreated }) {
    const [taskId, setTaskId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");

    const [team, setTeam] = useState([]);
    const [clients, setClients] = useState([]);

    const [assignedTo, setAssignedTo] = useState([]);
    const [client, setClient] = useState("");
    const [status, setStatus] = useState("todo");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const res = await axios.get("/api/users");

        setTeam(res.data.filter(u => u.role === "team"));
        setClients(res.data.filter(u => u.role === "client"));
    };

    const toggleMember = (email) => {
        setAssignedTo(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const createTask = async () => {
        if (!taskId) return alert("Task ID required");
        if (!title) return alert("Title required");
        if (assignedTo.length === 0) return alert("Assign team");
        if (!client) return alert("Select client");

        try {
            setLoading(true);

            await axios.post("/api/tasks", {
                taskId,
                title,
                description,
                assignedTo,
                client,
                deadline,
                status
            });

            setTaskId("");
            setTitle("");
            setDescription("");
            setAssignedTo([]);
            setClient("");
            setDeadline("");
            setStatus("todo");

            onCreated();
        } catch {
            alert("Task creation failed");
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
                placeholder="Task ID (TASK-001)"
                value={taskId}
                onChange={e => setTaskId(e.target.value)}
            />
            <br /><br />

            <input
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <br /><br />

            <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <br /><br />

            <h4>Assign Team</h4>
            {team.map(member => (
                <div key={member._id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={assignedTo.includes(member.email)}
                            onChange={() => toggleMember(member.email)}
                        />
                        {member.name}
                    </label>
                </div>
            ))}

            <br />

            <h4>Client</h4>
            <select value={client} onChange={e => setClient(e.target.value)}>
                <option value="">Select client</option>
                {clients.map(c => (
                    <option key={c._id} value={c.email}>
                        {c.name}
                    </option>
                ))}
            </select>

            <br /><br />

            <h4>Deadline</h4>
            <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
            />

            <br /><br />

            <h4>Status</h4>
            <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="todo">Todo</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
            </select>

            <br /><br />

            <button onClick={createTask} disabled={loading}>
                {loading ? "Creating..." : "Create Task"}
            </button>
        </div>
    );
}
