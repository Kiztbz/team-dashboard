import Kanban from "../components/Kanban";

export default function Owner({ user }) {
    return (
        <div style={{ padding: 30 }}>
            <h1>Owner Dashboard</h1>

            <p>Welcome {user.email}</p>

            <Kanban user={user} />
        </div>
    );
}
