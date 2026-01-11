import { V2Sidebar } from "./dashboard/_components/sidebar";
import { DashboardProviders } from "./dashboard/_components/dashboard-providers";
import "@/app/globals.css";

export default function V2Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardProviders>
            <div className="bg-background text-foreground font-sans antialiased overflow-hidden selection:bg-primary/20 selection:text-primary-foreground h-screen w-full relative">
                {/* Ambient Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
                    <div className="absolute inset-0 bg-grid opacity-60"></div>
                </div>

                {/* App Container */}
                <div className="relative z-10 flex h-screen w-full overflow-hidden">
                    <V2Sidebar />

                    {/* MAIN CONTENT */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {children}
                    </div>
                </div>
            </div>
        </DashboardProviders>
    );
}
