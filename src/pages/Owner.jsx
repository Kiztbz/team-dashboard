import Layout from "../components/Layout";
import Kanban from "../components/Kanban";

export default function Owner({ user, setUser }) {
    return (
        <Layout user={user} setUser={setUser}>
            <h1>Owner Dashboard</h1>
            <Kanban user={user} />
        </Layout>
    );
}
