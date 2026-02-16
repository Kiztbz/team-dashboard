import Layout from "../components/Layout";
import Kanban from "../components/Kanban";

export default function Team({ user, setUser }) {
    return (
        <Layout user={user} setUser={setUser}>
            <h1>Team Dashboard</h1>
            <Kanban user={user} />
        </Layout>
    );
}
