interface EditorPlaceholderProps {
    loading: boolean;
    message: string;
  }
  
  export default function EditorPlaceholder({ loading, message }: EditorPlaceholderProps) {
    return (
      <div className="flex-1 h-full overflow-auto p-6">
        <div className="text-gray-400 text-sm h-full flex items-center justify-center">
          {message}
        </div>
      </div>
    );
  }