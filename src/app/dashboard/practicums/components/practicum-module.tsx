"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Trash } from "lucide-react";
import Editor from "@/components/editor/yoopta-editor";
import { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";
import {
  createPracticumModule,
  createPracticumModuleContent,
  getModulesWithMaterials,
  getPracticumModuleContent,
  updatePracticumModuleContent
} from "@/lib/api/practicums";
import { INIT_VALUE } from "@/components/editor/init-value";

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  practicumId: string | null;
}

export const PracticumModulModal = ({ isOpen, onClose, practicumId }: FullScreenModalProps) => {
  const [creatingModule, setCreatingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [editorInstance, setEditorInstance] = useState<ReturnType<typeof createYooptaEditor> | null>(null);
  const [editorValue, setEditorValue] = useState<YooptaContentValue>(INIT_VALUE);
  const [expandedModuleId, setExpandedModuleId] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [loadingEditorContent, setLoadingEditorContent] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [currentMaterialContentId, setCurrentMaterialContentId] = useState<number | null>(null);
  const [currentMaterialMeta, setCurrentMaterialMeta] = useState<{ title: string; moduleId: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedMaterial && isOpen) {
      const fetchContent = async () => {
        try {
          setLoadingEditorContent(true);
          setEditorReady(false);

          // Check if it's a temporary material (negative ID)
          if (parseInt(selectedMaterial) < 0) {
            // For new materials, set the editor value to INIT_VALUE
            setTimeout(() => {
              setEditorValue(INIT_VALUE);
              setCurrentMaterialContentId(null);
              setLoadingEditorContent(false);
              setTimeout(() => setEditorReady(true), 100);
            }, 50);
          } else {
            // For existing materials, fetch content from the server
            try {
              const content = await getPracticumModuleContent(selectedMaterial);
              setCurrentMaterialContentId(content.id);

              setTimeout(() => {
                setEditorValue(content);
                setLoadingEditorContent(false);
                setTimeout(() => setEditorReady(true), 100);
              }, 50);
            } catch (error) {
              console.error("Material content not found, using default value:", error);
              setCurrentMaterialContentId(null);
              setEditorValue(INIT_VALUE);
              setLoadingEditorContent(false);
              setTimeout(() => setEditorReady(true), 100);
            }
          }
        } catch (err) {
          console.error("Failed to fetch material content:", err);
          setLoadingEditorContent(false);
          setEditorValue(INIT_VALUE);
          setTimeout(() => setEditorReady(true), 100);
        }
      };

      fetchContent();
    }
  }, [selectedMaterial, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMaterial(null);
      setModules([]);
      setNewModuleTitle("");
      setCreatingModule(false);
      setSelectedMaterial(null);
      setEditorValue(INIT_VALUE);
      setEditorInstance(null);
      setExpandedModuleId([]);
      setLoadingEditorContent(false);
      setCurrentMaterialContentId(null);
      setCurrentMaterialMeta(null);
    }
  }, [isOpen]);

  const handleEditorChange = (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setEditorValue(newValue);
  };

  const [modules, setModules] = useState<
    {
      id: number;
      title: string;
      materials: {
        id: number;
        title: string;
      }[];
      creatingMaterial?: boolean;
      newMaterialTitle?: string;
    }[]
  >([]);

  useEffect(() => {
    if (!isOpen || !practicumId) return;

    async function fetchModules() {
      try {
        if (practicumId) {
          const fetchedModules = await getModulesWithMaterials(practicumId);
          const formatted = fetchedModules.map((mod: any) => ({
            id: mod.id,
            title: mod.title,
            materials: mod.materials.map((mat: any) => ({
              id: mat.id,
              title: mat.title
            })),
          }));
          setModules(formatted);
        }
      } catch (err) {
        console.error("Failed to load modules:", err);
      }
    }

    fetchModules();
  }, [isOpen, practicumId]);

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim() || !practicumId) return;

    try {
      const newModule = await createPracticumModule({
        title: newModuleTitle.trim(),
        practicum_id: practicumId,
      });

      // Update modules state with new module
      setModules((prev) => [
        ...prev,
        {
          id: newModule.id,
          title: newModule.title,
          materials: [],
        },
      ]);

      setNewModuleTitle("");
      setCreatingModule(false);
      setExpandedModuleId([`module-${newModule.id}`]);

    } catch (err) {
      console.error("Failed to create module:", err);
    }
  };

  const handleMaterialClick = (materialId: string) => {
    console.log(materialId);
    
    setSelectedMaterial(materialId);

    // Find the module containing this material
    modules.forEach((mod) => {
      const material = mod.materials.find((m) => m.id.toString() === materialId);
      if (material) {
        setCurrentMaterialMeta({ title: material.title, moduleId: mod.id });
      }
    });
  };

  const handleAddMaterial = (moduleId: number) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? { ...mod, creatingMaterial: true, newMaterialTitle: "" }
          : mod
      )
    );
  };

  const handleMaterialInputChange = (moduleId: number, value: string) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId ? { ...mod, newMaterialTitle: value } : mod
      )
    );
  };

  const handleSave = async () => {
    console.log("Attempting to save:", {
      editorInstance,
      selectedMaterial,
      currentMaterialMeta,
    });
    
    if (!editorInstance || !selectedMaterial || !currentMaterialMeta) return;

    try {
      setIsSaving(true);
      const content = editorInstance.getEditorValue();

      const currentModule = modules.find((mod) => mod.id === currentMaterialMeta.moduleId);
      const currentIndex = currentModule?.materials.findIndex((m) => m.id.toString() === selectedMaterial);

      const payload = {
        id_module: currentMaterialMeta.moduleId,
        title: currentMaterialMeta.title,
        content,
        sequence: currentIndex !== undefined && currentIndex >= 0 ? currentIndex + 1 : 1,
      };

      if (selectedMaterial) {
        const updatedContent = await updatePracticumModuleContent(Number(selectedMaterial), payload);
        console.log("Content updated successfully", updatedContent);
      } 
    } catch (error) {
      console.error("Failed to save material content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMaterialSubmit = async (moduleId: number) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module?.newMaterialTitle?.trim()) {
      setModules(prev =>
        prev.map(mod => ({ ...mod, creatingMaterial: false }))
      );
      return;
    }

    const newMaterialTitle = module.newMaterialTitle.trim();

    try {
      // Generate a temporary negative ID for the new material
      const tempId = Math.floor(Math.random() * -1000) - 1;

      // Update the UI immediately with the new material
      setModules(prev =>
        prev.map(mod => {
          if (mod.id === moduleId) {
            return {
              ...mod,
              materials: [...mod.materials, {
                id: tempId,
                title: newMaterialTitle
              }],
              creatingMaterial: false,
              newMaterialTitle: "",
            };
          }
          return { ...mod, creatingMaterial: false };
        })
      );

      // Select the new material immediately
      setSelectedMaterial(tempId.toString());
      setCurrentMaterialMeta({ title: newMaterialTitle, moduleId });

      // Create a new material content with INIT_VALUE
      const currentModuleForNew = modules.find(m => m.id === moduleId);
      const materialIndex = currentModuleForNew?.materials.length || 0;

      const payload = {
        id_module: moduleId,
        title: newMaterialTitle,
        content: INIT_VALUE,
        sequence: materialIndex + 1,
      };

      // Create new content in the database
      const newContent = await createPracticumModuleContent(payload);

      // Update the material ID from temporary to real after creation
      setModules(prev =>
        prev.map(mod => {
          if (mod.id === moduleId) {
            return {
              ...mod,
              materials: mod.materials.map(mat => {
                if (mat.id === tempId) {
                  return { ...mat, id: newContent.id };
                }
                return mat;
              })
            };
          }
          return mod;
        })
      );

      // Update the selected material to the new real ID
      setSelectedMaterial(newContent.id.toString());
      setCurrentMaterialContentId(newContent.id);

      console.log("New material created successfully", newContent);
    } catch (error) {
      console.error("Failed to create new material:", error);
    }
  };

  const handleDeleteMaterial = async (moduleId: number, index: number) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const materialToDelete = module.materials[index];

    // If the material being deleted is currently selected, clear the selection
    if (selectedMaterial === materialToDelete.id.toString()) {
      setSelectedMaterial(null);
      setCurrentMaterialMeta(null);
      setCurrentMaterialContentId(null);
      setEditorValue(INIT_VALUE);
    }

    // Update the UI by removing the material
    setModules(prev =>
      prev.map(mod =>
        mod.id === moduleId
          ? {
            ...mod,
            materials: mod.materials.filter((_, i) => i !== index),
          }
          : mod
      )
    );

    // TODO: implement delete with api
    // await deletePracticumMaterial(materialToDelete.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="fixed inset-0 bg-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            ✕
          </button>
          <p className="font-bold">Pemrograman Mobile</p>
          <Button
            onClick={handleSave}
            disabled={isSaving || !selectedMaterial || !editorInstance}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
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

            <Accordion type="multiple" value={expandedModuleId} onValueChange={setExpandedModuleId}>
              {modules.map((module) => (
                <AccordionItem key={module.id} value={`module-${module.id}`}>
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
                      <Input
                        placeholder="Judul materi..."
                        value={module.newMaterialTitle || ""}
                        onChange={(e) =>
                          handleMaterialInputChange(module.id, e.target.value)
                        }
                        onBlur={() => handleMaterialSubmit(module.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleMaterialSubmit(module.id);
                        }}
                        autoFocus
                        className="text-sm mb-2"
                      />
                    )}

                    {module.materials.map((material, index) => (
                      <div
                        key={index}
                        onClick={() => handleMaterialClick(material.id.toString())}
                        className={`border rounded-md p-2 flex flex-row items-center gap-1 justify-between hover:cursor-pointer ${selectedMaterial === material.id.toString() ? 'bg-blue-100' : ''
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
                            handleDeleteMaterial(module.id, index);
                          }}
                          className="cursor-pointer hover:text-red-500"
                        >
                          <Trash className="size-4" />
                        </span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}

              {creatingModule && (
                <AccordionItem value="new-module">
                  <AccordionTrigger>
                    <Input
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      onBlur={() => {
                        if (newModuleTitle.trim()) {
                          handleCreateModule();
                        } else {
                          setCreatingModule(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateModule();
                        } else if (e.key === "Escape") {
                          setCreatingModule(false);
                        }
                      }}
                      autoFocus
                      placeholder="Nama modul..."
                      className="text-sm"
                    />
                  </AccordionTrigger>
                  <AccordionContent />
                </AccordionItem>
              )}
            </Accordion>
          </div>

          {/* Main Editor */}
          <div className="flex-1 h-full overflow-auto p-6">
            {selectedMaterial && !loadingEditorContent ? (
              <Editor
                value={editorValue}
                onInit={(instance) => {
                  setEditorInstance(instance);
                }}
                onChange={handleEditorChange}
                isReady={editorReady}
              />
            ) : (
              <div className="text-gray-400 text-sm h-full flex items-center justify-center">
                {loadingEditorContent ? "Loading content..." : "No material selected. Select or create a material to begin editing."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};