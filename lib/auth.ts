import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function getAuthSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);

        if (typeof payload.userId !== 'string' || typeof payload.email !== 'string') {
            return null;
        }

        return { userId: payload.userId, email: payload.email };
    } catch (error) {
        return null;
    }
}
