import React, { createContext, useContext, ReactNode } from "react";
import { useModules } from "../hooks/useModules";
import { ModuleContextType } from "../types";
import { useEditor } from "../hooks/useEditor";

const ModuleContext = createContext<ModuleContextType | null>(null);

export const ModuleProvider = ({
    children,
    practicumId
  }: {
    children: ReactNode;
    practicumId: string | null;
  }) => {
    const editor = useEditor(); 
    const moduleState = useModules(practicumId, editor); 
  
    return (
      <ModuleContext.Provider value={moduleState}>
        {children}
      </ModuleContext.Provider>
    );
  };

export const useModuleContext = () => {
    const context = useContext(ModuleContext);
    if (!context) {
        throw new Error("useModuleContext must be used within a ModuleProvider");
    }
    return context;
};

