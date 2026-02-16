import Sidebar from "./Sidebar";

export default function Layout({ user, setUser, children }) {
    return (
        <div style={{ display: "flex" }}>
            <Navbar user={user} setUser={setUser}>

            <div style={{ padding: 30, flex: 1 }}>
                {children}
            </div>
            </Navbar>
        </div>
    );
}
