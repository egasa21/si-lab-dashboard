"use client"
import { useMemo, useState, useRef } from "react";
import YooptaEditor, { createYooptaEditor, PluginElementRenderProps, YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";
import NextImage from 'next/image';

// Import plugins
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import Blockquote from '@yoopta/blockquote';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Code from '@yoopta/code';
import Accordion from '@yoopta/accordion';
import Table from '@yoopta/table';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import Divider from '@yoopta/divider';
import Callout from '@yoopta/callout';
import Embed from '@yoopta/embed';
import Video from '@yoopta/video';
import File from '@yoopta/file';

// Import tools
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

// Import marks
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { uploadToCloudinary } from "@/lib/cloudinary";

// Custom Image component using Next.js Image
const CustomImageComponent = ({ attributes, children, element, ...rest }: PluginElementRenderProps) => {
    const { src, alt, sizes } = element;

    return (
        <div {...attributes} className="relative my-4 w-full">
            <div contentEditable={false} className="w-full">
                <img
                    src={src}
                    alt={alt || 'Image'}
                    className="max-w-full h-auto rounded-md"
                    style={{
                        width: sizes?.width ? `${Math.min(sizes.width, 800)}px` : '100%',
                        maxWidth: '100%',
                    }}
                />
            </div>
            {children}
        </div>
    );
};

const plugins = [
    Paragraph,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Blockquote,
    Link,
    Accordion,
    Table,
    NumberedList,
    BulletedList,
    TodoList,
    Divider,
    Callout,
    Code,
    Embed,
    Image.extend({
        options: {
            HTMLAttributes: {
                className: 'image-element-extended',
            },
            async onUpload(file) {
                try {
                    console.log("Uploading image to Cloudinary...");
                    const data = await uploadToCloudinary(file, 'image');
                    console.log("Cloudinary response:", data);

                    return {
                        src: data.secure_url,
                        alt: file.name,
                        sizes: {
                            width: data.width,
                            height: data.height,
                        },
                    };
                } catch (error) {
                    console.error("Error uploading image:", error);
                    throw error;
                }
            },
        },
    }),
    Video.extend({
        options: {
            async onUpload(file) {
                const data = await uploadToCloudinary(file, 'video');
                return {
                    src: data.secure_url,
                    alt: file.name,
                    sizes: {
                        width: data.width,
                        height: data.height,
                    },
                };
            },
            async onUploadPoster(file) {
                const image = await uploadToCloudinary(file, 'image');
                return image.secure_url;
            },
        },
    }),
    File.extend({
        options: {
            async onUpload(file) {
                const data = await uploadToCloudinary(file, 'auto');
                return {
                    src: data.secure_url,
                    alt: file.name,
                    format: data.format,
                    name: data.name,
                    size: data.bytes,
                };
            },
        },
    }),
];

const TOOLS = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
    },
    Toolbar: {
        render: DefaultToolbarRender,
        tool: Toolbar,
    },
    LinkTool: {
        render: DefaultLinkToolRender,
        tool: LinkTool,
    },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

export default function Editor() {
    const editor = useMemo(() => createYooptaEditor(), []);
    const [value, setValue] = useState<YooptaContentValue>();
    const selectionRef = useRef(null);

    const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
        setValue(value);
        console.log("Editor content updated:", value);
    };

    return (
        <div className="w-full h-full min-h-[500px] md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center" ref={selectionRef}>
            <YooptaEditor
                width="100%"
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                value={value}
                onChange={onChange}
                placeholder="Type something"
                selectionBoxRoot={selectionRef}
                autoFocus
            />
        </div>
    );
}