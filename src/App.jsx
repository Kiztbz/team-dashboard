import { useState } from "react";
import Login from "./pages/Login";
import Owner from "./pages/Owner";
import Team from "./pages/Team";
import Client from "./pages/Client";

export default function App() {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const [tasks, setTasks] = useState(
        JSON.parse(localStorage.getItem("tasks")) || []
    );

    // keep tasks persistent
    const updateTasks = (newTasks) => {
        setTasks(newTasks);
        localStorage.setItem("tasks", JSON.stringify(newTasks));
    };

    if (!user) return <Login setUser={setUser} />;

    if (user.role === "owner")
        return (
            <Owner
                user={user}
                setUser={setUser}
                tasks={tasks}
                updateTasks={updateTasks}
            />
        );

    if (user.role === "team_member")
        return (
            <Team
                user={user}
                setUser={setUser}
                tasks={tasks}
                updateTasks={updateTasks}
            />
        );

    if (user.role === "client")
        return (
            <Client
                user={user}
                setUser={setUser}
                tasks={tasks}
            />
        );

    return <Login setUser={setUser} />;
}
