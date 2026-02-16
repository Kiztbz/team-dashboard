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
        <div className="card">
            <h3>🚀 Create New Task</h3>

            <input className="input"
                placeholder="Task ID"
                value={taskId}
                onChange={e => setTaskId(e.target.value)}
            />

            <input className="input"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <textarea className="input"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            <h4>Team</h4>
            {team.map(member => (
                <label key={member._id}>
                    <input
                        type="checkbox"
                        checked={assignedTo.includes(member.email)}
                        onChange={() => toggleMember(member.email)}
                    />
                    {" "} {member.name}
                </label>
            ))}

            <h4>Client</h4>
            <select className="input" value={client} onChange={e => setClient(e.target.value)}>
                <option value="">Select</option>
                {clients.map(c => (
                    <option key={c._id} value={c.email}>
                        {c.name}
                    </option>
                ))}
            </select>

            <h4>Deadline</h4>
            <input
                className="input"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
            />

            <button className="button" onClick={createTask}>
                Create Task
            </button>
        </div>
    );

}
