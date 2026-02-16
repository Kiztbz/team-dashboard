import Kanban from "../components/Kanban";

export default function Client({ user }) {
    return (
        <div style={{ padding: 30 }}>
            <h1>Client Portal</h1>

            <Kanban user={user} />
        </div>
    );
}
