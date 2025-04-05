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

// Import Shadcn UI components
import { TypographyP } from '../typography/TypographyP';
import { TypographyH1 } from '../typography/TypographyH1';
import { TypographyH2 } from '../typography/TypographyH2';
import { TypographyH3 } from '../typography/TypographyH3';
import { TypographyBlockquote } from '../typography/TypographyBlockquote';
import { TypographyLink } from '../typography/TypographyLink';
import { AccordionList, AccordionListItem, AccordionListItemContent, AccordionListItemHeading } from '../typography/Accordion';
import { TableRow, Table as TableShadcn, TableDataCell } from '../typography/Table';


const plugins = [
    Paragraph.extend({
        renders: {
            paragraph: TypographyP,
        },
    }),
    HeadingOne.extend({
        renders: {
            'heading-one': TypographyH1,
        },
    }),
    HeadingTwo.extend({
        renders: {
            'heading-two': TypographyH2,
        },
    }),
    HeadingThree.extend({
        renders: {
            'heading-three': TypographyH3,
        },
    }),
    Blockquote.extend({
        renders: {
            blockquote: TypographyBlockquote,
        },
    }),
    Link.extend({
        renders: {
            link: TypographyLink,
        },
    }),
    Accordion.extend({
        renders: {
            'accordion-list': AccordionList,
            'accordion-list-item': AccordionListItem,
            'accordion-list-item-content': AccordionListItemContent,
            'accordion-list-item-heading': AccordionListItemHeading,
        },
    }),
    Table.extend({
        renders: {
            table: TableShadcn,
            'table-row': TableRow,
            'table-data-cell': TableDataCell,
        },
    }),
    NumberedList,
    BulletedList,
    TodoList,
    Divider.extend({
        elementProps: {
            divider: (props) => ({
                ...props,
                color: 'hsl(240 3.7% 15.9%)',
            }),
        },
    }),
    Callout,
    Code,
    Embed,
    Image.extend({
        renders: {
            image: (props: PluginElementRenderProps) => {
                const { children, element, attributes } = props;

                return (
                    // [NOTE] passing attributes is required
                    <div {...attributes}>
                        <NextImage
                            src={element.props.src}
                            alt={element.props.alt}
                            width={element.props.sizes.width}
                            height={element.props.sizes.height}
                        />
                        {/* [NOTE] passing children is required */}
                        {children}
                    </div>
                );
            }
        },
    }),
    Video.extend({
        // options: {
        //   onUpload: async (file) => {
        //     const data = await uploadToCloudinary(file, 'video');
        //     return {
        //       src: data.secure_url,
        //       alt: 'cloudinary',
        //       sizes: {
        //         width: data.width,
        //         height: data.height,
        //       },
        //     };
        //   },
        //   onUploadPoster: async (file) => {
        //     const image = await uploadToCloudinary(file, 'image');
        //     return image.secure_url;
        //   },
        // },
    }),
    File.extend({
        // options: {
        //   onUpload: async (file) => {
        //     const response = await uploadToCloudinary(file, 'auto');
        //     return { src: response.secure_url, format: response.format, name: response.name, size: response.bytes };
        //   },
        // },
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

    const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
        setValue(value);
    };

    return (
        <YooptaEditor
            editor={editor}
            plugins={plugins}
            tools={TOOLS}
            marks={MARKS}
            value={value}
            onChange={onChange}
            placeholder="Type something"
            autoFocus
        />

    );
}