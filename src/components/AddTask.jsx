import { useState, useEffect } from "react";
import axios from "axios";

export default function AddTask({ onCreated }) {
    const [title, setTitle] = useState("");
    const [team, setTeam] = useState([]);
    const [clients, setClients] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);
    const [client, setClient] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const res = await axios.get("/api/users");

        const all = res.data;

        setTeam(all.filter(u => u.role === "team"));
        setClients(all.filter(u => u.role === "client"));
    };

    const toggleMember = (email) => {
        setAssignedTo(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const createTask = async () => {
        if (!title) return alert("Task title required");
        if (assignedTo.length === 0) return alert("Assign at least one team member");
        if (!client) return alert("Select client");

        try {
            setLoading(true);

            await axios.post("/api/tasks", {
                title,
                assignedTo,
                client,
                status: "todo"
            });

            setTitle("");
            setAssignedTo([]);
            setClient("");

            onCreated();
        } catch {
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
                onChange={e => setTitle(e.target.value)}
            />

            <h4>Assign Team</h4>
            {team.map(member => (
                <div key={member._id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={assignedTo.includes(member.email)}
                            onChange={() => toggleMember(member.email)}
                        />
                        {member.name} ({member.email})
                    </label>
                </div>
            ))}

            <h4>Select Client</h4>
            <select value={client} onChange={e => setClient(e.target.value)}>
                <option value="">Choose client</option>
                {clients.map(c => (
                    <option key={c._id} value={c.email}>
                        {c.name} — {c.company}
                    </option>
                ))}
            </select>

            <br /><br />

            <button onClick={createTask} disabled={loading}>
                {loading ? "Creating..." : "Add Task"}
            </button>
        </div>
    );
}
