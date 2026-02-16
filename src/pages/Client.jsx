import Layout from "../components/Layout";
import Kanban from "../components/Kanban";

export default function Client({ user, setUser }) {
    return (
        <Layout user={user} setUser={setUser}>
            <h1>Client Dashboard</h1>
            <Kanban user={user} />
        </Layout>
    );
}
