import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { createClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/env";

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    let userProfile = null;

    if (isMockMode) {
        userProfile = {
            name: "Mock User",
            email: "mock@vaksetu.com",
            avatar: "",
        };
    } else {
        try {
            const supabase = await createClient();
            const { data } = await supabase.auth.getUser();
            const user = data?.user;

            if (user) {
                userProfile = {
                    name: user.user_metadata?.full_name || user.user_metadata?.name || "",
                    email: user.email || "",
                    avatar: user.user_metadata?.avatar_url || "",
                };
            }
        } catch (error: any) {
            if (error.digest?.startsWith("DYNAMIC_SERVER_USAGE") || error.message?.includes("dynamic-server-error")) {
                throw error;
            }
            console.error("[DashboardLayout] Error retrieving user profile:", error);
        }
    }

    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar user={userProfile} />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
