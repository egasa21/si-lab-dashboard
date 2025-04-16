import { useState, useEffect, useCallback } from "react";
import {
    getModulesWithMaterials,
    createPracticumModule,
    createPracticumModuleContent,
    deletePracticumModuleContent,
    updatePracticumModuleContent
} from "@/lib/api/practicums";
import { Module, ModuleContextType } from "../types";
import { useEditor } from "./useEditor";
import { INIT_VALUE } from "@/components/editor/init-value";

export const useModules = (
    practicumId: string | null,
    editor: ReturnType<typeof useEditor>
): ModuleContextType => {
    const [modules, setModules] = useState<Module[]>([]);
    const [creatingModule, setCreatingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [expandedModuleIds, setExpandedModuleIds] = useState<string[]>([]);
    const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
    const [currentMaterialMeta, setCurrentMaterialMeta] = useState<{
        title: string;
        moduleId: number
    } | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const {
        editorInstance,
        editorValue,
        currentMaterialContentId,
        setEditorInstance,
        setEditorValue,
        loadingContent,
        editorReady,
        handleEditorChange,
        initializeEditor
      } = editor;
    

    // Calculate if save button should be enabled
    const canSave = !!editorInstance || !!selectedMaterialId || !!currentMaterialMeta;

    // Fetch modules when modal opens
    useEffect(() => {
        if (!practicumId) return;

        const fetchModules = async () => {
            try {
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
            } catch (err) {
                console.error("Failed to load modules:", err);
            }
        };

        fetchModules();
    }, [practicumId]);

    const handleCreateModule = useCallback(async () => {
        if (!newModuleTitle.trim() || !practicumId) return;

        try {
            const newModule = await createPracticumModule({
                title: newModuleTitle.trim(),
                practicum_id: practicumId,
            });

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
            setExpandedModuleIds((prev) => [...prev, `module-${newModule.id}`]);
        } catch (err) {
            console.error("Failed to create module:", err);
        }
    }, [newModuleTitle, practicumId]);

    const handleAddMaterial = useCallback((moduleId: number) => {
        setModules((prev) =>
            prev.map((mod) =>
                mod.id === moduleId
                    ? { ...mod, creatingMaterial: true, newMaterialTitle: "" }
                    : mod
            )
        );
    }, []);

    const handleMaterialInputChange = useCallback((moduleId: number, value: string) => {
        setModules((prev) =>
            prev.map((mod) =>
                mod.id === moduleId
                    ? { ...mod, newMaterialTitle: value }
                    : mod
            )
        );
    }, []);

    const handleMaterialSubmit = useCallback(async (moduleId: number) => {
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
            setSelectedMaterialId(tempId.toString());
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
            setSelectedMaterialId(newContent.id.toString());

            console.log("New material created successfully", newContent);
        } catch (error) {
            console.error("Failed to create new material:", error);
        }
    }, [modules]);

    const handleDeleteMaterial = useCallback(async (moduleId: number, index: number) => {
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;

        const materialToDelete = module.materials[index];

        // If the material being deleted is currently selected, clear the selection
        if (selectedMaterialId === materialToDelete.id.toString()) {
            setSelectedMaterialId(null);
            setCurrentMaterialMeta(null);
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

        try {
            await deletePracticumModuleContent(materialToDelete.id);
        } catch (error) {
            console.error("Error deleting material:", error);
        }
    }, [modules, selectedMaterialId]);

    const selectMaterial = useCallback((materialId: string, moduleId: number, materialTitle: string) => {
        setSelectedMaterialId(materialId);
        setCurrentMaterialMeta({
            title: materialTitle,
            moduleId
        });
    }, []);

    const saveCurrentMaterial = useCallback(async () => {

        console.log("Attempting to save:", {
            editorInstance,
            selectedMaterialId,
            currentMaterialMeta,
        });

        if (!editorInstance || !selectedMaterialId || !currentMaterialMeta) return;

        try {
            setIsSaving(true);
            const content = editorInstance.getEditorValue();

            const currentModule = modules.find((mod) => mod.id === currentMaterialMeta.moduleId);
            const currentIndex = currentModule?.materials.findIndex((m) => m.id.toString() === selectedMaterialId);

            const payload = {
                id_module: currentMaterialMeta.moduleId,
                title: currentMaterialMeta.title,
                content,
                sequence: currentIndex !== undefined && currentIndex >= 0 ? currentIndex + 1 : 1,
            };

            if (selectedMaterialId) {
                await updatePracticumModuleContent(Number(selectedMaterialId), payload);
                console.log("Content updated successfully");
            }
        } catch (error) {
            console.error("Failed to save material content:", error);
        } finally {
            setIsSaving(false);
        }
    }, [editorInstance, selectedMaterialId, currentMaterialMeta, modules]);

    return {
        modules,
        setModules,
        creatingModule,
        setCreatingModule,
        newModuleTitle,
        setNewModuleTitle,
        expandedModuleIds,
        setExpandedModuleIds,
        selectedMaterialId,
        setSelectedMaterialId,
        currentMaterialMeta,
        setCurrentMaterialMeta,
        isSaving,
        setIsSaving,
        canSave,
        handleCreateModule,
        handleAddMaterial,
        handleMaterialInputChange,
        handleMaterialSubmit,
        handleDeleteMaterial,
        selectMaterial,
        saveCurrentMaterial,
        editorInstance,
        setEditorInstance,
        editorValue,
        setEditorValue,
        currentMaterialContentId,
        loadingContent,
        editorReady,
        handleEditorChange,
        initializeEditor,
    };
};