import Kanban from "../components/Kanban";

export default function Team({ user }) {
    return (
        <div style={{ padding: 30 }}>
            <h1>Team Dashboard</h1>

            <Kanban user={user} />
        </div>
    );
}
