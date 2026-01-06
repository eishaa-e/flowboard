import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
    await connectDB();
    const session = await getAuthSession();

    if (!session) {
        redirect("/login");
    }

    const user = await User.findById(session.userId);

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col gap-8 p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="/avatars/shadcn.jpg" alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
