const login = async () => {
    try {
        const res = await axios.post("/api/auth", {
            email,
            password
        });

        const user = res.data.user;

        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "owner") window.location = "/owner";
        if (user.role === "admin") window.location = "/admin";
        if (user.role === "team_member") window.location = "/team";
        if (user.role === "client") window.location = "/client";

    } catch (err) {
        alert("Invalid login");
    }
};
