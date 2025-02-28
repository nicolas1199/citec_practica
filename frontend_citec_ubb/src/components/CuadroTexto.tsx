import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import UnderLine from '@tiptap/extension-underline';
import {
    IconAlignBoxCenterTop,
    IconAlignBoxLeftStretch,
    IconAlignBoxRightStretch,
    IconArrowBackUp,
    IconBold,
    IconHeading,
    IconItalic,
    IconList,
    IconListNumbers,
    IconPhoto,
    IconQuoteFilled,
    IconRuler3,
    IconStrikethrough,
    IconUnderline,
} from '@tabler/icons-react';

interface CuadroTextoProps {
    onContentChange?: (content: string) => void;
    initialContent?: string;
}

const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            class: {
                default: 'block my-4 mx-auto',
                parseHTML: (element) => element.getAttribute('class'),
                renderHTML: (attributes) => ({ class: attributes.class }),
            },
        };
    },
});

const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1],
            HTMLAttributes: {
                class: 'text-2xl font-bold my-4',
            },
        },
        bulletList: {
            HTMLAttributes: {
                class: 'list-disc pl-8 my-2',
            },
        },
        orderedList: {
            HTMLAttributes: {
                class: 'list-decimal pl-8 my-2',
            },
        },
    }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    ListItem.configure({ types: [TextStyle.name] }),
    UnderLine.configure({ types: [TextStyle.name] }),
    CustomImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
            class: '"mx-auto block my-4',
        },
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
];

const MenuBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    const handleAlignment = (alignment: 'left' | 'center' | 'right') => {
        if (editor?.isActive('image')) {
            const currentClass = editor.getAttributes('image').class || '';
            let newClass = '';

            switch (alignment) {
                case 'left':
                    newClass = 'block my-4 ml-0 mr-auto';
                    break;
                case 'center':
                    newClass = 'block my-4 mx-auto';
                    break;
                case 'right':
                    newClass = 'block my-4 ml-auto mr-0';
                    break;
                default:
                    newClass = 'block my-4 mx-auto';
            }

            editor.commands.updateAttributes('image', {
                class:
                    newClass !== currentClass ? newClass : 'block my-4 mx-auto',
            });
        } else {
            editor.chain().focus().setTextAlign(alignment).run();
        }
    };

    const getAlignmentClass = (position: string) => {
        if (!editor?.isActive('image')) return '';

        const currentClass = editor.getAttributes('image').class || '';
        return currentClass.includes(
            ` ${position === 'left' ? 'ml-0' : position === 'right' ? 'mr-0' : 'mx-auto'}`,
        )
            ? 'bg-gray-200 rounded'
            : '';
    };

    return (
        <div>
            <div className="flex items-center">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                        editor.isActive('bold') ? 'bg-gray-200' : ''
                    }
                    `}
                >
                    <IconBold stroke={2} />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can().chain().focus().toggleItalic().run()
                    }
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                        editor.isActive('italic') ? 'bg-gray-200' : ''
                    }
                    `}
                >
                    <IconItalic />
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    disabled={
                        !editor.can().chain().focus().toggleUnderline().run()
                    }
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                        editor.isActive('underline') ? 'bg-gray-200' : ''
                    }
                    `}
                >
                    <IconUnderline />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can().chain().focus().toggleStrike().run()
                    }
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                        editor.isActive('strike') ? 'bg-gray-200' : ''
                    }
                    `}
                >
                    <IconStrikethrough />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                        editor.isActive('heading', { level: 1 })
                            ? 'bg-gray-200'
                            : ''
                    }`}
                >
                    <IconHeading />
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                        editor.isActive('bulletList') ? 'bg-gray-200' : ''
                    }`}
                >
                    <IconList />
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                        editor.isActive('orderedList') ? 'bg-gray-200' : ''
                    }
                    `}
                >
                    <IconListNumbers />
                </button>

                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                        editor.isActive('blockquote') ? 'bg-gray-200' : ''
                    }
                    `}
                >
                    <IconQuoteFilled />
                </button>

                <button
                    type="button"
                    className={
                        'p-2 hover:bg-gray-100 rounded transition-colors'
                    }
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                >
                    <IconRuler3 />
                </button>

                <button
                    type="button"
                    className={
                        'p-2 hover:bg-gray-100 rounded transition-colors'
                    }
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                >
                    <IconArrowBackUp />
                </button>

                <button
                    type="button"
                    onClick={() =>
                        document.getElementById('file-input')?.click()
                    }
                    className="p-2 hover:bg-gray-100 rounded transition-colors relative"
                >
                    <IconPhoto />
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const base64 = event.target?.result;
                                    if (base64) {
                                        editor
                                            .chain()
                                            .focus()
                                            .setImage({ src: base64 })
                                            .run();
                                    }
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </button>
            </div>

            <div className="flex items-center mt-2">
                <button
                    type="button"
                    onClick={() => handleAlignment('left')}
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${getAlignmentClass('left')}`}
                >
                    <IconAlignBoxLeftStretch />
                </button>

                <button
                    type="button"
                    onClick={() => handleAlignment('center')}
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${getAlignmentClass('center')}`}
                >
                    <IconAlignBoxCenterTop />
                </button>

                <button
                    type="button"
                    onClick={() => handleAlignment('right')}
                    className={`p-2 hover:bg-gray-100 rounded transition-colors ${getAlignmentClass('right')}`}
                >
                    <IconAlignBoxRightStretch />
                </button>
            </div>
        </div>
    );
};

const CuadroTexto: React.FC<CuadroTextoProps> = ({
    onContentChange,
    initialContent,
}) => {
    return (
        <EditorProvider
            slotBefore={<MenuBar />}
            extensions={extensions}
            content={initialContent || ''}
            onUpdate={({ editor }) => {
                onContentChange?.(editor.getHTML());
            }}
        />
    );
};

export default CuadroTexto;
