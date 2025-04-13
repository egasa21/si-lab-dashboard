"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Trash } from "lucide-react";
import Editor from "@/components/editor/yoopta-editor";
import { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";
import { getModulesWithMaterials, getPracticumModuleContent } from "@/lib/api/practicums";
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

  useEffect(() => {
    if (selectedMaterial && isOpen) {
      const fetchContent = async () => {
        try {
          setLoadingEditorContent(true);
          setEditorReady(false);
          const content = await getPracticumModuleContent(selectedMaterial);

          setTimeout(() => {
            setEditorValue(content);
            setLoadingEditorContent(false);
            setTimeout(() => setEditorReady(true), 100);
          }, 50);
        } catch (err) {
          console.error("Failed to fetch material content:", err);
          setLoadingEditorContent(false);
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

  const handleCreateModule = () => {
    if (!newModuleTitle.trim()) return;

    const newModule = {
      id: Date.now(),
      title: newModuleTitle.trim(),
      materials: [],
    };

    setModules((prev) => [...prev, newModule]);
    setNewModuleTitle("");
    setCreatingModule(false);
    setExpandedModuleId([`module-${newModule.id}`]);
  };

  const handleMaterialClick = (materialId: string) => {
    setSelectedMaterial(materialId);
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
    if (!editorInstance) {
      console.warn("Editor not ready yet!");
      return;
    }

    const content = editorInstance.getEditorValue();
    const contentJSON = JSON.stringify(content);
    console.log("Saving content:", content);
    console.log("JSON content:", contentJSON);

    // TODO: send `content` to server
    // await fetch('/api/save', { method: 'POST', body: JSON.stringify(content) })
  };

  const handleMaterialSubmit = (moduleId: number) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId && mod.newMaterialTitle?.trim()) {
          // You'll need to create the ID server-side normally
          // This is just a temporary client-side ID for new materials
          const tempId = Math.floor(Math.random() * -1000) - 1; // Negative ID to indicate temporary

          return {
            ...mod,
            materials: [...mod.materials, {
              id: tempId,
              title: mod.newMaterialTitle
            }],
            creatingMaterial: false,
            newMaterialTitle: "",
          };
        }
        return { ...mod, creatingMaterial: false };
      })
    );
  };

  const handleDeleteMaterial = (moduleId: number, index: number) => {
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? {
            ...mod,
            materials: mod.materials.filter((_, i) => i !== index),
          }
          : mod
      )
    );
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
          <Button onClick={handleSave}>Save</Button>
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
                        className="border rounded-md p-2 flex flex-row items-center gap-1 justify-between hover:cursor-pointer"
                      >
                        <div className="flex flex-row items-center gap-1">
                          <span className="border border-gray-300 rounded-md w-6 h-6 flex items-center justify-center text-sm text-gray-600">
                            {index + 1}
                          </span>
                          <p>{material.title}</p>
                        </div>
                        <span
                          onClick={() => handleDeleteMaterial(module.id, index)}
                          className="cursor-pointer"
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
            {selectedMaterial && !loadingEditorContent && editorValue ? (
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
                {loadingEditorContent ? "Loading content..." : "No material selected."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
