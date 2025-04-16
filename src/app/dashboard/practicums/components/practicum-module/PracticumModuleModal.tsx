"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import ModuleSidebar from "./ModuleSidebar";
import MaterialEditor from "./MaterialEditor";
import { ModuleProvider, useModuleContext } from "./context/ModuleContext";

interface PracticumModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  practicumId: string | null;
}

export const PracticumModuleModal = ({ 
  isOpen, 
  onClose, 
  practicumId 
}: PracticumModuleModalProps) => {
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Any cleanup logic when modal closes
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModuleProvider practicumId={practicumId}>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="fixed inset-0 bg-white overflow-hidden flex flex-col">
          {/* Header */}
          <ModalHeader onClose={onClose} />
          
          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            <ModuleSidebar />
            <MaterialEditor />
          </div>
        </div>
      </div>
    </ModuleProvider>
  );
};

// Header extracted as a separate component
const ModalHeader = ({ 
  onClose 
}: { 
  onClose: () => void 
}) => {
  const { saveCurrentMaterial, isSaving, canSave } = useModuleContext();
  
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-800 text-xl font-bold"
      >
        ✕
      </button>
      <p className="font-bold">Pemrograman Mobile</p>
      <Button
        onClick={saveCurrentMaterial}
        disabled={isSaving || !canSave}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};