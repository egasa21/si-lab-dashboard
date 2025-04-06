import { PracticumSidebar } from "../components/practicum-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";



export default function PracticumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <PracticumSidebar variant="inset" />
            <SidebarInset>
                <div className="flex flex-1 flex-col p-4">
                    {children}
                </div>
            </SidebarInset>
        </div>
    );
}

