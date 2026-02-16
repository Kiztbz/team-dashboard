import Layout from "../components/Layout";

export default function Team({ user, setUser }) {
    return (
        <Layout user={user} setUser={setUser}>
            <h1>Team Dashboard</h1>
        </Layout>
    );
}
