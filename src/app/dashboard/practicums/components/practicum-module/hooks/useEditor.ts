import { useState, useCallback, useEffect } from "react";
import { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";
import { INIT_VALUE } from "@/components/editor/init-value";
import { getPracticumModuleContent } from "@/lib/api/practicums";

export const useEditor = () => {
    const [editorInstance, setEditorInstance] = useState<ReturnType<typeof createYooptaEditor> | null>(null);
    const [editorValue, setEditorValue] = useState<YooptaContentValue>(INIT_VALUE);
    const [loadingContent, setLoadingContent] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [currentMaterialContentId, setCurrentMaterialContentId] = useState<number | null>(null);

    const handleEditorChange = useCallback((newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
        setEditorValue(newValue);
    }, []);

    const initializeEditor = useCallback(async (materialId: string) => {
        try {
            setLoadingContent(true);
            setEditorReady(false);

            // Check if it's a temporary material (negative ID)
            if (parseInt(materialId) < 0) {
                // For new materials, set the editor value to INIT_VALUE
                setTimeout(() => {
                    setEditorValue(INIT_VALUE);
                    setCurrentMaterialContentId(null);
                    setLoadingContent(false);
                    setTimeout(() => setEditorReady(true), 100);
                }, 50);
            } else {
                // For existing materials, fetch content from the server
                try {
                    const content = await getPracticumModuleContent(materialId);
                    setCurrentMaterialContentId(content.id);

                    setTimeout(() => {
                        setEditorValue(content);
                        setLoadingContent(false);
                        setTimeout(() => setEditorReady(true), 100);
                    }, 50);
                } catch (error) {
                    console.error("Material content not found, using default value:", error);
                    setCurrentMaterialContentId(null);
                    setEditorValue(INIT_VALUE);
                    setLoadingContent(false);
                    setTimeout(() => setEditorReady(true), 100);
                }
            }
        } catch (err) {
            console.error("Failed to fetch material content:", err);
            setLoadingContent(false);
            setEditorValue(INIT_VALUE);
            setTimeout(() => setEditorReady(true), 100);
        }
    }, []);

    // Reset editor state when component unmounts
    useEffect(() => {
        return () => {
            setEditorInstance(null);
            setEditorValue(INIT_VALUE);
            setEditorReady(false);
            setCurrentMaterialContentId(null);
        };
    }, []);

    return {
        editorInstance,
        setEditorInstance,
        editorValue,
        setEditorValue,
        loadingContent,
        editorReady,
        currentMaterialContentId,
        handleEditorChange,
        initializeEditor
    };
};