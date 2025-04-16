import { Accordion } from "@/components/ui/accordion";
import { useModuleContext } from "../context/ModuleContext";
import ModuleItem from "./ModuleItem";
import NewModuleForm from "./NewModuleForm";

export default function ModuleSidebar() {
  const {
    modules,
    creatingModule,
    setCreatingModule,
    expandedModuleIds,
    setExpandedModuleIds
  } = useModuleContext();

  return (
    <div className="w-96 bg-gray-100 h-full overflow-y-auto border-r border-gray-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500">Modul Praktikum</span>
        <button
          onClick={() => setCreatingModule(true)}
          className="text-blue-500 text-sm font-medium hover:underline"
        >
          Modul Baru
        </button>
      </div>

      <Accordion
        type="multiple"
        value={expandedModuleIds}
        onValueChange={setExpandedModuleIds}
      >
        {modules.map((module) => (
          <ModuleItem
            key={module.id}
            module={module}
          />
        ))}

        {creatingModule && <NewModuleForm />}
      </Accordion>
    </div>
  );
}