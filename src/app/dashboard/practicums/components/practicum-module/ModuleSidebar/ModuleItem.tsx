// src/app/dashboard/practicums/components/practicum-module/ModuleSidebar/ModuleItem.tsx
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PlusCircleIcon } from "lucide-react";
import MaterialItem from "./MaterialItem";
import NewMaterialForm from "./NewMaterialForm";
import { useModuleContext } from "../context/ModuleContext";
import { Module } from "../types";

interface ModuleItemProps {
  module: Module;
}

export default function ModuleItem({ module }: ModuleItemProps) {
  const { handleAddMaterial } = useModuleContext();
  
  return (
    <AccordionItem value={`module-${module.id}`}>
      <AccordionTrigger>{module.title}</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-2 p-1">
        <div className="flex justify-between p-1.5">
          <span className="font-bold text-xs">
            {module.materials.length} Chapters
          </span>
          <button
            className="text-sm text-blue-500 self-start"
            onClick={() => handleAddMaterial(module.id)}
          >
            <PlusCircleIcon className="h-4 w-4" />
          </button>
        </div>

        {module.creatingMaterial && (
          <NewMaterialForm moduleId={module.id} />
        )}

        {module.materials.map((material, index) => (
          <MaterialItem
            key={material.id}
            material={material}
            moduleId={module.id}
            index={index}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}