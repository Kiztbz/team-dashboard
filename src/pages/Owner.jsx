import { useState } from "react";
import Layout from "../components/Layout";

export default function Owner({ user, setUser, tasks, updateTasks }) {
    const [title, setTitle] = useState("");
    const [assignedTo, setAssignedTo] = useState("team_member");

    const createTask = () => {
        if (!title) return alert("Enter task");

        const newTask = {
            id: Date.now(),
            title,
            assignedTo,
            status: "pending",
            progress: 0
        };

        updateTasks([...tasks, newTask]);
        setTitle("");
    };

    return (
        <Layout user={user} setUser={setUser}>
            <h1>Owner Dashboard</h1>

            <h3>Create Task</h3>

            <input
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <select onChange={(e) => setAssignedTo(e.target.value)}>
                <option value="team_member">Team</option>
                <option value="client">Client</option>
            </select>

            <button onClick={createTask}>Add Task</button>

            <hr />

            <h3>All Tasks</h3>

            {tasks.map(task => (
                <div key={task.id}>
                    <p>
                        {task.title} — {task.status} ({task.progress}%)
                    </p>
                </div>
            ))}
        </Layout>
    );
}
