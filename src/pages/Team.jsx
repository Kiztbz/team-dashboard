import Layout from "../components/Layout";
import Kanban from "../components/Kanban";

export default function Team({ user, setUser }) {
    return (
        <Layout user={user} setUser={setUser}>
            <div className="dashboard">
                <h1>📊 Dashboard</h1>
                <Kanban user={user} />
            </div>
        </Layout>
    );
}
