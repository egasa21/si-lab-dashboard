import { useState, useEffect } from "react";

export function useSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const checkSidebar = () => {
            const sidebarElement = document.querySelector(".sidebar"); // Change based on actual sidebar class
            setIsSidebarOpen(sidebarElement?.classList.contains("open") || false);
        };
        checkSidebar();
        window.addEventListener("resize", checkSidebar);
        return () => window.removeEventListener("resize", checkSidebar);
    }, []);

    return { isSidebarOpen };
}
