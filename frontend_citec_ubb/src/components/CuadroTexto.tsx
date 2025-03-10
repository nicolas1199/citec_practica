import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import React, { useState, useEffect, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import UnderLine from '@tiptap/extension-underline';

import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
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
    IconQuote,
    IconRuler3,
    IconStrikethrough,
    IconTable,
    IconTableColumn,
    IconTableRow,
    IconTrash,
    IconUnderline,
    IconTablePlus,
    IconColumnInsertRight,
    IconColumnInsertLeft,
    IconRowInsertBottom,
    IconRowInsertTop,
} from '@tabler/icons-react';

interface CuadroTextoProps {
    onContentChange?: (content: string) => void;
    initialContent?: string;
    storageKey?: string;
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
        blockquote: {
            HTMLAttributes: {
                class: 'border-l-4 border-gray-300 pl-4 py-2 my-3 bg-gray-50 italic',
            },
        },
    }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure(),
    UnderLine.configure(),
    CustomImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
            class: 'mx-auto block my-4',
        },
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Table.configure({
        resizable: true,
        HTMLAttributes: {
            class: 'border-collapse border border-gray-300 w-[90] my-2 table-auto mx-auto',
        },
    }),
    TableRow.configure({
        HTMLAttributes: {
            class: 'border border-gray-300',
        },
    }),
    TableHeader.configure({
        HTMLAttributes: {
            class: 'bg-gray-100 font-bold border border-gray-300 px-4 py-2 text-center',
        },
    }),
    TableCell.configure({
        HTMLAttributes: {
            class: 'border border-gray-300 px-4 py-2',
        },
    }),
];

const TableMenu = ({ editor }) => {
    const [showTableOptions, setShowTableOptions] = useState(false);

    if (!editor) return null;

    const isTableSelected = editor.isActive('table');

    const createTable = () => {
        if (isTableSelected) {
            setShowTableOptions(!showTableOptions);
            return;
        }

        editor
            .chain()
            .focus()
            .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
            })
            .run();

        setShowTableOptions(true);
    };

    const tableActions = {
        addRowBefore: () => editor.chain().focus().addRowBefore().run(),
        addRowAfter: () => editor.chain().focus().addRowAfter().run(),
        deleteRow: () => editor.chain().focus().deleteRow().run(),

        addColumnBefore: () => editor.chain().focus().addColumnBefore().run(),
        addColumnAfter: () => editor.chain().focus().addColumnAfter().run(),
        deleteColumn: () => editor.chain().focus().deleteColumn().run(),

        toggleHeaderRow: () => editor.chain().focus().toggleHeaderRow().run(),
        toggleHeaderColumn: () =>
            editor.chain().focus().toggleHeaderColumn().run(),

        mergeCells: () => editor.chain().focus().mergeCells().run(),
        splitCell: () => editor.chain().focus().splitCell().run(),

        deleteTable: () => {
            editor.chain().focus().deleteTable().run();
            setShowTableOptions(false);
        },
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={createTable}
                className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                    isTableSelected ? 'bg-gray-200' : ''
                }`}
                aria-label="Tabla"
                title="Insertar/editar tabla"
            >
                <IconTable size={20} />
            </button>

            {showTableOptions && isTableSelected && (
                <div className="absolute left-0 bg-white shadow-lg rounded-md border border-gray-200 p-2 z-10 w-60 mt-1">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="col-span-2 border-b pb-2 mb-2">
                            <h4 className="text-xs font-bold text-gray-500 mb-1">
                                FILAS
                            </h4>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={tableActions.addRowBefore}
                                    className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 rounded p-1 text-xs flex-1"
                                    title="Añadir fila antes"
                                >
                                    <IconRowInsertTop size={16} />
                                    <span>↑ Antes</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={tableActions.addRowAfter}
                                    className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 rounded p-1 text-xs flex-1"
                                    title="Añadir fila después"
                                >
                                    <IconRowInsertBottom size={16} />
                                    <span>↓ Después</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={tableActions.deleteRow}
                                    className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 rounded p-1 text-xs flex-1 text-red-600"
                                    title="Eliminar fila"
                                >
                                    <IconTrash size={16} />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>

                        <div className="col-span-2 border-b pb-2 mb-2">
                            <h4 className="text-xs font-bold text-gray-500 mb-1">
                                COLUMNAS
                            </h4>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={tableActions.addColumnBefore}
                                    className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 rounded p-1 text-xs flex-1"
                                    title="Añadir columna antes"
                                >
                                    <IconColumnInsertLeft size={16} />
                                    <span>← Antes</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={tableActions.addColumnAfter}
                                    className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 rounded p-1 text-xs flex-1"
                                    title="Añadir columna después"
                                >
                                    <IconColumnInsertRight size={16} />
                                    <span>→ Después</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={tableActions.deleteColumn}
                                    className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 rounded p-1 text-xs flex-1 text-red-600"
                                    title="Eliminar columna"
                                >
                                    <IconTrash size={16} />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>

                        <div className="border-b pb-2 mb-2 pr-1">
                            <h4 className="text-xs font-bold text-gray-500 mb-1">
                                ENCABEZADOS
                            </h4>
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={tableActions.toggleHeaderRow}
                                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded p-1 text-xs"
                                    title="Convertir fila en encabezado"
                                >
                                    <span>Fila</span>
                                    <IconTableRow size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={tableActions.toggleHeaderColumn}
                                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded p-1 text-xs"
                                    title="Convertir columna en encabezado"
                                >
                                    <span>Columna</span>
                                    <IconTableColumn size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="border-b pb-2 mb-2 pl-1">
                            <h4 className="text-xs font-bold text-gray-500 mb-1">
                                CELDAS
                            </h4>
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={tableActions.mergeCells}
                                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded p-1 text-xs"
                                    title="Fusionar celdas"
                                >
                                    <span>Fusionar</span>
                                    <IconTablePlus size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={tableActions.splitCell}
                                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded p-1 text-xs"
                                    title="Dividir celda"
                                >
                                    <span>Dividir</span>
                                    <IconTablePlus
                                        size={16}
                                        className="rotate-45"
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="col-span-2 pt-1">
                            <button
                                type="button"
                                onClick={tableActions.deleteTable}
                                className="w-full flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 rounded p-1.5 text-sm font-medium"
                                title="Eliminar tabla"
                            >
                                <IconTrash size={16} />
                                <span>Eliminar tabla</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MenuBar = () => {
    const { editor } = useCurrentEditor();
    const fileInputId = React.useMemo(
        () =>
            `file-input-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        [],
    );

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
        } else if (editor?.isActive('table')) {
            const table = editor.state.selection.$anchor.node(-1);
            if (table) {
                let alignmentClass = '';
                switch (alignment) {
                    case 'left':
                        alignmentClass = 'ml-0 mr-auto';
                        break;
                    case 'center':
                        alignmentClass = 'mx-auto';
                        break;
                    case 'right':
                        alignmentClass = 'ml-auto mr-0';
                        break;
                    default:
                        alignmentClass = 'mx-auto';
                }

                editor
                    .chain()
                    .focus()
                    .updateAttributes('table', {
                        class: `border-collapse border border-gray-300 w-[90%] my-4 table-auto ${alignmentClass}`,
                    })
                    .run();
            }
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
            <div className="flex items-center gap-1">
                <div className="flex border-r pr-1">
                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleBold().run()
                        }
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                            editor.isActive('bold') ? 'bg-gray-200' : ''
                        }
                    `}
                        aria-label="Negrita"
                        title="Negrita"
                    >
                        <IconBold stroke={2} />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleItalic().run()
                        }
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                            editor.isActive('italic') ? 'bg-gray-200' : ''
                        }
                    `}
                        aria-label="Cursiva"
                        title="Cursiva"
                    >
                        <IconItalic />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        disabled={
                            !editor
                                .can()
                                .chain()
                                .focus()
                                .toggleUnderline()
                                .run()
                        }
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                            editor.isActive('underline') ? 'bg-gray-200' : ''
                        }
                    `}
                        aria-label="Subrayado"
                        title="Subrayado"
                    >
                        <IconUnderline />
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleStrike().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleStrike().run()
                        }
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                            editor.isActive('strike') ? 'bg-gray-200' : ''
                        }
                    `}
                        aria-label="Tachado"
                        title="Tachado"
                    >
                        <IconStrikethrough />
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run()
                        }
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                            editor.isActive('heading', { level: 1 })
                                ? 'bg-gray-200'
                                : ''
                        }`}
                        aria-label="Encabezado"
                        title="Encabezado"
                    >
                        <IconHeading />
                    </button>
                </div>

                <div className="flex border-r pr-1">
                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                            editor.isActive('bulletList') ? 'bg-gray-200' : ''
                        }`}
                        aria-label="Lista"
                        title="Lista con viñetas"
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
                        aria-label="Lista numerada"
                        title="Lista numerada"
                    >
                        <IconListNumbers />
                    </button>
                </div>

                <div className="flex border-r pr-1">
                    <button
                        type="button"
                        onClick={() => handleAlignment('left')}
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${getAlignmentClass(
                            'left',
                        )}`}
                        aria-label="Alinear a la izquierda"
                        title="Alinear a la izquierda"
                    >
                        <IconAlignBoxLeftStretch />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleAlignment('center')}
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${getAlignmentClass(
                            'center',
                        )}`}
                        aria-label="Centrar"
                        title="Centrar"
                    >
                        <IconAlignBoxCenterTop />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleAlignment('right')}
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${getAlignmentClass(
                            'right',
                        )}`}
                        aria-label="Alinear a la derecha"
                        title="Alinear a la derecha"
                    >
                        <IconAlignBoxRightStretch />
                    </button>
                </div>

                <div className="flex">
                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                            editor.isActive('blockquote') ? 'bg-gray-200' : ''
                        }`}
                        aria-label="Cita"
                        title="Insertar cita"
                    >
                        <IconQuote size={20} stroke={2} />
                    </button>

                    <button
                        type="button"
                        className={
                            'p-2 hover:bg-gray-100 rounded transition-colors'
                        }
                        onClick={() =>
                            editor.chain().focus().setHorizontalRule().run()
                        }
                        aria-label="Línea horizontal"
                        title="Insertar línea horizontal"
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
                        aria-label="Deshacer"
                        title="Deshacer"
                    >
                        <IconArrowBackUp />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            document.getElementById(fileInputId)?.click()
                        }
                        className="p-2 hover:bg-gray-100 rounded transition-colors relative"
                        aria-label="Insertar imagen"
                        title="Insertar imagen"
                    >
                        <IconPhoto />
                        <input
                            id={fileInputId}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 5000000) {
                                        alert('La imagen es demasiado grande');
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const base64 = event.target?.result;
                                        if (base64) {
                                            editor
                                                .chain()
                                                .focus()
                                                .setImage({
                                                    src: base64 as string,
                                                })
                                                .run();
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }

                                e.target.value = '';
                            }}
                        />
                    </button>

                    <TableMenu editor={editor} />
                </div>
            </div>
        </div>
    );
};

const CuadroTexto: React.FC<CuadroTextoProps> = ({
    onContentChange,
    initialContent,
    storageKey = 'editor-draft',
}) => {
    const [content, setContent] = useState(initialContent || '');
    const editorKey = useRef(Math.random().toString(36).substring(7));

    useEffect(() => {
        const savedContent = localStorage.getItem(storageKey);
        if (savedContent && !initialContent) {
            setContent(savedContent);
            onContentChange?.(savedContent);
        } else if (initialContent !== content) {
            setContent(initialContent || '');
        }
    }, [onContentChange, initialContent, storageKey, content]);

    return (
        <div className="border border-gray-300 rounded-md shadow-sm hover:shadow-md transition-shadow">
            <EditorProvider
                key={`editor-${storageKey}-${editorKey.current}`}
                extensions={extensions}
                content={content}
                slotBefore={<MenuBar />}
                onUpdate={({ editor }) => {
                    const html = editor.getHTML();
                    localStorage.setItem(storageKey, html);
                    onContentChange?.(html);
                }}
                editorProps={{
                    attributes: {
                        class: 'p-4 prose max-w-none focus:outline-none min-h-[100px]',
                    },
                }}
            />
        </div>
    );
};

export default CuadroTexto;
