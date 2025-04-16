// src/app/dashboard/practicums/components/practicum-module/MaterialEditor/index.tsx
import { useEffect } from "react";
import Editor from "@/components/editor/yoopta-editor";
import { useModuleContext } from "../context/ModuleContext";
import { useEditor } from "../hooks/useEditor";
import EditorPlaceholder from "./EditorPlaceholder";

export default function MaterialEditor() {
    //   const { selectedMaterialId } = useModuleContext();
    const {
        selectedMaterialId,
        editorInstance,
        setEditorInstance,
        editorValue,
        handleEditorChange,
        loadingContent,
        editorReady,
        initializeEditor
    } = useModuleContext();

    // Load material content when selection changes
    useEffect(() => {
        if (selectedMaterialId) {
            initializeEditor(selectedMaterialId);
        }
    }, [selectedMaterialId, initializeEditor]);

    if (!selectedMaterialId || loadingContent) {
        return (
            <EditorPlaceholder
                loading={loadingContent}
                message={loadingContent ? "Loading content..." : "No material selected. Select or create a material to begin editing."}
            />
        );
    }

    return (
        <div className="flex-1 h-full overflow-auto p-6">
            <Editor
                value={editorValue}
                onInit={(instance) => {
                    setEditorInstance(instance);
                }}
                onChange={handleEditorChange}
                isReady={editorReady}
            />
        </div>
    );
}