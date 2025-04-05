import { SiteHeader } from "@/components/site-header";
import { PracticumSidebar } from "../components/practicum-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";



export default function PracticumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }>
            <PracticumSidebar variant="inset" />
            <SidebarInset>
                <div className="flex flex-1 flex-col p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

{/* <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          {children}
        </div>
      </SidebarInset> */}