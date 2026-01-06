import axios from "axios";

const baseURL = typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/api"
    : "/api";

export const api = axios.create({
    baseURL,
});
