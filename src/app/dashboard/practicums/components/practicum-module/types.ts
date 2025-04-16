import { createYooptaEditor, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";

export interface Material {
  id: number;
  title: string;
}

export interface Module {
  id: number;
  title: string;
  materials: Material[];
  creatingMaterial?: boolean;
  newMaterialTitle?: string;
}

export interface MaterialContent {
  id: number;
  id_module: number;
  title: string;
  content: YooptaContentValue;
  sequence: number;
}

export interface CreateModulePayload {
  title: string;
  practicum_id: string;
}

export interface CreateMaterialPayload {
  id_module: number;
  title: string;
  content: YooptaContentValue;
  sequence: number;
}

export interface ModuleContextType {
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  creatingModule: boolean;
  setCreatingModule: React.Dispatch<React.SetStateAction<boolean>>;
  newModuleTitle: string;
  setNewModuleTitle: React.Dispatch<React.SetStateAction<string>>;
  expandedModuleIds: string[];
  setExpandedModuleIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMaterialId: string | null;
  setSelectedMaterialId: React.Dispatch<React.SetStateAction<string | null>>;
  currentMaterialMeta: { title: string; moduleId: number } | null;
  setCurrentMaterialMeta: React.Dispatch<React.SetStateAction<{ title: string; moduleId: number } | null>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  canSave: boolean;
  handleCreateModule: () => Promise<void>;
  handleAddMaterial: (moduleId: number) => void;
  handleMaterialInputChange: (moduleId: number, value: string) => void;
  handleMaterialSubmit: (moduleId: number) => Promise<void>;
  handleDeleteMaterial: (moduleId: number, index: number) => Promise<void>;
  selectMaterial: (materialId: string, moduleId: number, materialTitle: string) => void;
  saveCurrentMaterial: () => Promise<void>;
  editorInstance: ReturnType<typeof createYooptaEditor> | null;
  setEditorInstance: React.Dispatch<React.SetStateAction<ReturnType<typeof createYooptaEditor> | null>>;
  editorValue: YooptaContentValue;
  setEditorValue: React.Dispatch<React.SetStateAction<YooptaContentValue>>;
  loadingContent: boolean;
  editorReady: boolean;
  currentMaterialContentId: number | null;
  handleEditorChange: (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => void;
  initializeEditor: (materialId: string) => Promise<void>;
  
}