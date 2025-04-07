import Editor from "@/components/editor/yoopta-editor";
import NoLayout from "@/components/no-layout";

export default function ModuleContents() {
    return (
        <div>
            <Editor/>
        </div>
    );
}



ModuleContents.getLayout = function getLayout(page: React.ReactElement) {
    return <NoLayout>{page}</NoLayout>;
};
