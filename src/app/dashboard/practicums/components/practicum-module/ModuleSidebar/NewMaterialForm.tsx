import { Input } from "@/components/ui/input";
import { useModuleContext } from "../context/ModuleContext";

interface NewMaterialFormProps {
  moduleId: number;
}

export default function NewMaterialForm({ moduleId }: NewMaterialFormProps) {
  const { 
    modules,
    handleMaterialInputChange, 
    handleMaterialSubmit 
  } = useModuleContext();

  const module = modules.find(m => m.id === moduleId);
  const newMaterialTitle = module?.newMaterialTitle || "";

  const handleBlur = () => {
    handleMaterialSubmit(moduleId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMaterialSubmit(moduleId);
    }
  };

  return (
    <Input
      placeholder="Judul materi..."
      value={newMaterialTitle}
      onChange={(e) => handleMaterialInputChange(moduleId, e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      className="text-sm mb-2"
    />
  );
}