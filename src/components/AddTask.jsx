import { useState } from "react";
import { supabase } from "../supabase";

export default function AddTask({ onCreated }) {
    const [taskId, setTaskId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [client, setClient] = useState("");
    const [status, setStatus] = useState("todo");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createTask = async () => {
        if (!taskId.trim()) return setError("Task ID is required");
        if (!title.trim()) return setError("Title is required");

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const assignedArray = assignedTo.split(",").map(s => s.trim()).filter(Boolean);

            const { error: insertError } = await supabase.from("tasks").insert({
                task_id: taskId.trim(),
                title: title.trim(),
                description: description.trim(),
                assigned_to: assignedArray,
                client: client.trim(),
                deadline: deadline || null,
                status,
            });

            if (insertError) {
                console.error("Insert error:", insertError);
                setError(insertError.message);
                return;
            }

            setTaskId(""); setTitle(""); setDescription("");
            setDeadline(""); setAssignedTo(""); setClient(""); setStatus("todo");
            setSuccess(true);
            if (onCreated) onCreated();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Task creation failed:", err);
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") createTask();
    };

    return (
        <div style={container}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={iconBox}>🚀</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3" }}>New Task</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Fill in the details below</div>
                </div>
            </div>

            {error && <div style={errStyle}>⚠ {error}</div>}
            {success && <div style={okStyle}>✓ Task created!</div>}

            <div className="add-task-grid">
                <Field label="Task ID" placeholder="e.g. TASK-001" value={taskId} onChange={setTaskId} onKeyDown={handleKeyDown} />
                <Field label="Title" placeholder="Task title" value={title} onChange={setTitle} onKeyDown={handleKeyDown} />
                <Field label="Client" placeholder="Client name" value={client} onChange={setClient} onKeyDown={handleKeyDown} />
                <Field label="Deadline" type="date" value={deadline} onChange={setDeadline} onKeyDown={handleKeyDown} />
                <div>
                    <label style={labelStyle}>Status</label>
                    <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="todo">📋 To Do</option>
                        <option value="progress">🔄 In Progress</option>
                        <option value="done">✅ Done</option>
                    </select>
                </div>
                <Field label="Assign To" placeholder="Comma-separated" value={assignedTo} onChange={setAssignedTo} onKeyDown={handleKeyDown} />
            </div>

            <div style={{ marginTop: 8 }}>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: 64, resize: "vertical" }}
                    placeholder="Describe the task..." value={description}
                    onChange={e => setDescription(e.target.value)} />
            </div>

            <button onClick={createTask} disabled={loading}
                style={{ ...btnStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Creating..." : "Create Task"}
            </button>
        </div>
    );
}

function Field({ label, placeholder, value, onChange, onKeyDown, type = "text" }) {
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <input type={type} style={{ ...inputStyle, ...(type === "date" ? { colorScheme: "dark" } : {}) }}
                placeholder={placeholder} value={value}
                onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} />
        </div>
    );
}

const container = { padding: "16px 18px", borderRadius: 10, background: "#161b22", border: "1px solid #21262d" };
const iconBox = { width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 7, background: "rgba(38,120,111,0.12)", fontSize: 15 };
const labelStyle = { display: "block", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 4, letterSpacing: 0.6, textTransform: "uppercase" };
const inputStyle = { width: "100%", padding: "9px 10px", borderRadius: 6, border: "1px solid #21262d", background: "#0d1117", color: "#e6edf3", outline: "none", fontSize: 12, boxSizing: "border-box", transition: "border-color 0.15s" };
const btnStyle = { width: "100%", padding: 10, borderRadius: 6, border: "none", background: "#26786f", color: "white", fontWeight: 600, fontSize: 12, cursor: "pointer", marginTop: 12, transition: "background 0.15s, opacity 0.15s" };
const errStyle = { padding: "8px 12px", borderRadius: 6, fontSize: 12, marginBottom: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" };
const okStyle = { padding: "8px 12px", borderRadius: 6, fontSize: 12, marginBottom: 10, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" };
