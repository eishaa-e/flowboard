import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { redirect } from "next/navigation"
import { api } from "@/lib/axios"
import { cookies } from "next/headers"

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    let user;

    try {
        const { data } = await api.get("/auth/me", {
            headers: {
                Cookie: cookieStore.toString()
            }
        })
        user = data;
    } catch {
        redirect("/login")
    }

    const userData = {
        name: user.name,
        email: user.email,
        avatar: "/avatars/shadcn.jpg" // Default avatar
    }

    return (
        <SidebarProvider>
            <AppSidebar user={userData} />
            <main className="w-full">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}
