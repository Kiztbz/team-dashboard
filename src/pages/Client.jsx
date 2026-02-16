import Layout from "../components/Layout";

export default function Client({ user, setUser }) {
    return (
        <Layout user={user} setUser={setUser}>
            <h1>Client Dashboard</h1>
        </Layout>
    );
}
