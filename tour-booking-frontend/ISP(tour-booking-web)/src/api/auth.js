import { api } from "./client";

export async function registerUser(payload) {
    const { data } = await api.post("/api/users", payload);
    return data;
}

export async function login(payload) {
    const { data } = await api.post("/api/auth/login", payload);
    // Your backend returns: { token: "...", user: {...} } (as in your screenshot)
    localStorage.setItem("tb_token", data.token);
    localStorage.setItem("tb_user", JSON.stringify(data.user));
    return data;
}

export async function logout() {
    await api.delete("/api/auth/logout");
    localStorage.removeItem("tb_token");
    localStorage.removeItem("tb_user");
}
