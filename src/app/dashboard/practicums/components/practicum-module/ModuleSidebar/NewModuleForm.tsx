import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useModuleContext } from "../context/ModuleContext";

export default function NewModuleForm() {
  const { 
    newModuleTitle, 
    setNewModuleTitle, 
    handleCreateModule,
    setCreatingModule 
  } = useModuleContext();

  const handleBlur = () => {
    if (newModuleTitle.trim()) {
      handleCreateModule();
    } else {
      setCreatingModule(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateModule();
    } else if (e.key === "Escape") {
      setCreatingModule(false);
    }
  };

  return (
    <AccordionItem value="new-module">
      <AccordionTrigger>
        <Input
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Nama modul..."
          className="text-sm"
        />
      </AccordionTrigger>
      <AccordionContent />
    </AccordionItem>
  );
}