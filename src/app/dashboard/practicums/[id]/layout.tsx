import { SiteHeader } from "@/components/site-header";
import { PracticumSidebar } from "../components/practicum-sidebar";


export default function PracticumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <PracticumSidebar variant="inset"/>
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

{/* <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          {children}
        </div>
      </SidebarInset> */}