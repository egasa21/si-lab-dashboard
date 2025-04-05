"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAuth } from "@/context/auth-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Trash } from "lucide-react";

export function PracticumSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 flex justify-between">
              <span onClick={() => { }} className="hover:cursor-pointer">
                <span className="text-xs font-bold text-gray-500">Modul Praktikum</span>
                <span className="font-bold text-blue-400">Modul Baru</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <Accordion type="multiple" className="w-full p-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Dasar Pemrograman</AccordionTrigger>
            <AccordionContent className="flex-col gap-2 flex">
              <div className="border rounded-md p-2 flex flex-row items-center gap-1 justify-between">
                <div className="flex flex-row items-center gap-1" onClick={()=> {}}> 
                  <span className="border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center text-sm text-gray-600">
                    1
                  </span>
                  <p>Function</p>
                </div>
                <span onClick={() => { }}><Trash className="size-4" /></span>
              </div>
              <div className="border rounded-md p-2 flex flex-row items-center gap-1 justify-between">
                <div className="flex flex-row items-center gap-1" onClick={()=> {}}> 
                  <span className="border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center text-sm text-gray-600">
                    1
                  </span>
                  <p>Function</p>
                </div>
                <span onClick={() => { }}><Trash className="size-4" /></span>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Dasar Pemrograman</AccordionTrigger>
            <AccordionContent className="flex-col gap-2 flex">
              <div className="border rounded-md p-2 flex flex-row items-center gap-1 justify-between">
                <div className="flex flex-row items-center gap-1" onClick={()=> {}}> 
                  <span className="border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center text-sm text-gray-600">
                    1
                  </span>
                  <p>Function</p>
                </div>
                <span onClick={() => { }}><Trash className="size-4" /></span>
              </div>
              <div className="border rounded-md p-2 flex flex-row items-center gap-1 justify-between">
                <div className="flex flex-row items-center gap-1" onClick={()=> {}}> 
                  <span className="border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center text-sm text-gray-600">
                    1
                  </span>
                  <p>Function</p>
                </div>
                <span onClick={() => { }}><Trash className="size-4" /></span>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </SidebarContent>
    </Sidebar>
  );
}
