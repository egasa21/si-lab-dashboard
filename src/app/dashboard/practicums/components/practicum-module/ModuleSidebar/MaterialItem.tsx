// src/app/dashboard/practicums/components/practicum-module/ModuleSidebar/MaterialItem.tsx
import { Trash } from "lucide-react";
import { useModuleContext } from "../context/ModuleContext";
import { Material } from "../types";

interface MaterialItemProps {
  material: Material;
  moduleId: number;
  index: number;
}

export default function MaterialItem({ material, moduleId, index }: MaterialItemProps) {
  const { selectMaterial, selectedMaterialId, handleDeleteMaterial } = useModuleContext();

  const isSelected = selectedMaterialId === material.id.toString();

  return (
    <div
      onClick={() => selectMaterial(material.id.toString(), moduleId, material.title)}
      className={`border rounded-md p-2 flex flex-row items-center gap-1 justify-between hover:cursor-pointer ${
        isSelected ? 'bg-blue-100' : ''
      }`}
    >
      <div className="flex flex-row items-center gap-1">
        <span className="border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center text-sm text-gray-600">
          {index + 1}
        </span>
        <p>{material.title}</p>
      </div>
      <span
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteMaterial(moduleId, index);
        }}
        className="cursor-pointer hover:text-red-500"
      >
        <Trash className="size-4" />
      </span>
    </div>
  );
}