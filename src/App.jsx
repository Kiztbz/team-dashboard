import { useState } from "react";
import Login from "./pages/Login";
import Owner from "./pages/Owner";
import Team from "./pages/Team";
import Client from "./pages/Client";
import Kanban from "./pages/Kanban";

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

    if (user.role === "owner") return <Kanban user={user} />;
    if (user.role === "team") return <Kanban user={user} />;
    if (user.role === "client") return <Kanban user={user} />;


    return <Login setUser={setUser} />;
}
