import { AuthGate } from "@/components/auth/auth-gate";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userProfile = user
        ? {
            name: user.user_metadata?.full_name || user.user_metadata?.name || "",
            email: user.email || "",
            avatar: user.user_metadata?.avatar_url || "",
        }
        : null;

    return (
        <AuthGate>
            <SidebarProvider defaultOpen={false}>
                <AppSidebar user={userProfile} />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </AuthGate>
    );
}