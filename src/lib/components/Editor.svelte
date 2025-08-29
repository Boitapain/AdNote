<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Editor } from "@tiptap/core";
    import StarterKit from "@tiptap/starter-kit";
    import Heading from "@tiptap/extension-heading";
    import TaskList from "@tiptap/extension-task-list";
    import TaskItem from "@tiptap/extension-task-item";
    import Placeholder from "@tiptap/extension-placeholder";
    import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
    import Dropcursor from "@tiptap/extension-dropcursor";
    import DragHandle from "@tiptap/extension-drag-handle";
    import BubbleMenu from "@tiptap/extension-bubble-menu";
    import { TextStyle, Color } from '@tiptap/extension-text-style';
    import Highlight from '@tiptap/extension-highlight';
    import { SlashCommand } from "$lib/extensions/slash-command";
    import { createLowlight } from 'lowlight';
    
    // Import common languages for syntax highlighting
    import javascript from 'highlight.js/lib/languages/javascript';
    import typescript from 'highlight.js/lib/languages/typescript';
    import python from 'highlight.js/lib/languages/python';
    import css from 'highlight.js/lib/languages/css';
    import html from 'highlight.js/lib/languages/xml';
    import json from 'highlight.js/lib/languages/json';
    import bash from 'highlight.js/lib/languages/bash';
    
    // Create lowlight instance and register languages
    const lowlight = createLowlight();
    lowlight.register('javascript', javascript);
    lowlight.register('typescript', typescript);
    lowlight.register('python', python);
    lowlight.register('css', css);
    lowlight.register('html', html);
    lowlight.register('json', json);
    lowlight.register('bash', bash);

    let { content = "", onUpdate }: { content?: string, onUpdate: (updatedContent: string) => void } = $props();

    let editor: Editor | null = $state(null);
    let slashMenuVisible = $state(false);
    let slashMenuPosition = $state({ top: 0, left: 0 });
    let selectedCommandIndex = $state(0);
    let slashPosition = 0;
    let colorDropdownVisible = $state(false);

    // Function to position color dropdown below bubble menu
    function positionColorDropdown() {
        if (colorDropdownVisible) {
            setTimeout(() => {
                const bubbleMenu = document.querySelector('#bubble-menu');
                const colorMenu = document.querySelector('#color-menu');
                if (bubbleMenu && colorMenu) {
                    const bubbleRect = bubbleMenu.getBoundingClientRect();
                    const colorMenuElement = colorMenu as HTMLElement;
                    colorMenuElement.style.position = 'fixed';
                    colorMenuElement.style.top = `${bubbleRect.bottom + 8}px`;
                    colorMenuElement.style.left = `${bubbleRect.right - 280}px`; // Align to right edge
                    colorMenuElement.style.zIndex = '1001';
                }
            }, 10);
        }
    }

    // Watch for color dropdown visibility changes
    $effect(() => {
        positionColorDropdown();
    });

    const commands = [
        { 
            title: "Text", 
            description: "Just start writing with plain text",
            icon: "📄",
            command: () => {}
        },
        { 
            title: "Heading 1", 
            description: "Big section heading",
            icon: "H",
            command: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() 
        },
        { 
            title: "Heading 2", 
            description: "Medium section heading",
            icon: "H",
            command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() 
        },
        { 
            title: "Heading 3", 
            description: "Small section heading",
            icon: "H",
            command: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() 
        },
        { 
            title: "Bulleted list", 
            description: "Create a simple bulleted list",
            icon: "•",
            command: () => editor?.chain().focus().toggleBulletList().run() 
        },
        { 
            title: "Numbered list", 
            description: "Create a list with numbering",
            icon: "1.",
            command: () => editor?.chain().focus().toggleOrderedList().run() 
        },
        { 
            title: "To-do list", 
            description: "Track tasks with a to-do list",
            icon: "☐",
            command: () => editor?.chain().focus().toggleTaskList().run()
        },
        { 
            title: "Quote", 
            description: "Capture a quote",
            icon: "💬",
            command: () => editor?.chain().focus().toggleBlockquote().run() 
        },
        { 
            title: "Divider", 
            description: "Visually divide blocks",
            icon: "—",
            command: () => editor?.chain().focus().setHorizontalRule().run() 
        },
        { 
            title: "Code", 
            description: "Capture a code snippet",
            icon: "</>",
            command: () => editor?.chain().focus().toggleCodeBlock().run() 
        },
    ];

    function openSlashMenu(position: number, slashPos?: number) {
        const coords = editor?.view.coordsAtPos(position);
        if (coords) {
            slashMenuPosition = { 
                top: coords.top + window.scrollY + 1, 
                left: coords.left + window.scrollX - 5
            };
            slashMenuVisible = true;
            selectedCommandIndex = 0;
            if (slashPos !== undefined) {
                slashPosition = slashPos;
            }
        }
    }

    function closeSlashMenu() {
        slashMenuVisible = false;
        selectedCommandIndex = 0;
    }

    function executeCommand(command: () => void) {
        // Remove the slash first
        if (editor && slashPosition >= 0) {
            const { tr } = editor.state;
            tr.delete(slashPosition, slashPosition + 1);
            editor.view.dispatch(tr);
        }
        
        // Execute the command
        setTimeout(() => {
            command();
            closeSlashMenu();
            editor?.commands.focus();
        }, 10);
    }

    function parseContent(contentStr: string) {
        if (!contentStr) return "";
        try {
            return JSON.parse(contentStr);
        } catch {
            return contentStr;
        }
    }

    onMount(() => {
        // Wait for DOM to be ready
        setTimeout(() => {
            editor = new Editor({
                element: document.querySelector("#editor"),
                extensions: [
                    StarterKit.configure({
                        heading: false,
                        codeBlock: false,
                        dropcursor: false,
                    }),
                    Dropcursor.configure({
                        color: '#2EA6DC',
                        width: 4,
                    }),
                    DragHandle.configure({
                        render: () => {
                            const handle = document.createElement('div');
                            handle.classList.add('notion-drag-handle');
                            handle.innerHTML = '⋮⋮';
                            handle.setAttribute('contenteditable', 'false');
                            handle.setAttribute('draggable', 'true');
                            return handle;
                        },
                    }),
                    Heading.configure({
                        levels: [1, 2, 3],
                    }),
                    TaskList,
                    TaskItem.configure({
                        nested: true,
                    }),
                    TextStyle,
                    Color,
                    Highlight.configure({
                        multicolor: true,
                    }),
                    BubbleMenu.configure({
                        element: document.querySelector('#bubble-menu') as HTMLElement,
                    }),
                    CodeBlockLowlight.configure({
                    lowlight,
                    languageClassPrefix: 'language-',
                    defaultLanguage: 'plaintext',
                }),
                Placeholder.configure({
                    placeholder: ({ node }) => {
                        if (node.type.name === 'heading') {
                            const level = node.attrs.level;
                            return level === 1 ? 'Heading 1' : level === 2 ? 'Heading 2' : 'Heading 3';
                        }
                        if (node.type.name === 'codeBlock') {
                            return 'Type your code...';
                        }
                        return "Type '/' for commands";
                    },
                    includeChildren: true,
                }),
                SlashCommand.configure({
                    commands,
                    onOpen: openSlashMenu,
                }),
            ],
            content: parseContent(content),
            onUpdate: ({ editor }) => {
                const updatedContent = JSON.stringify(editor.getJSON());
                onUpdate(updatedContent);
                
                if (slashMenuVisible) {
                    const { state } = editor;
                    const from = state.selection.$from;
                    const textAfterSlash = state.doc.textBetween(slashPosition + 1, from.pos);
                    
                    if (textAfterSlash.length > 0 && textAfterSlash !== '') {
                        closeSlashMenu();
                    }
                }
            },
        });
        }, 10); // Small delay to ensure DOM is ready

        const handleKeyDown = (event: KeyboardEvent) => {
            if (slashMenuVisible) {
                if (event.key === 'Escape') {
                    event.preventDefault();
                    closeSlashMenu();
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    selectedCommandIndex = Math.min(selectedCommandIndex + 1, commands.length - 1);
                    scrollToSelectedItem();
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    selectedCommandIndex = Math.max(selectedCommandIndex - 1, 0);
                    scrollToSelectedItem();
                } else if (event.key === 'Enter') {
                    event.preventDefault();
                    executeCommand(commands[selectedCommandIndex].command);
                }
            }
        };

        function scrollToSelectedItem() {
            const menu = document.querySelector('.slash-menu');
            const selectedItem = document.querySelector(`.slash-menu .w-full:nth-child(${selectedCommandIndex + 1})`);
            
            if (menu && selectedItem) {
                const menuRect = menu.getBoundingClientRect();
                const itemRect = selectedItem.getBoundingClientRect();
                const menuScrollTop = menu.scrollTop;
                
                if (itemRect.bottom > menuRect.bottom) {
                    // Item is below visible area, scroll down
                    menu.scrollTop = menuScrollTop + (itemRect.bottom - menuRect.bottom) + 10;
                } else if (itemRect.top < menuRect.top) {
                    // Item is above visible area, scroll up
                    menu.scrollTop = menuScrollTop - (menuRect.top - itemRect.top) - 10;
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        // Close slash menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (slashMenuVisible) {
                const slashMenu = document.querySelector('.slash-menu');
                if (slashMenu && !slashMenu.contains(event.target as Node)) {
                    closeSlashMenu();
                }
            }
            
            if (colorDropdownVisible) {
                const colorDropdown = document.querySelector('.notion-color-menu');
                const colorButton = document.querySelector('.notion-color-button');
                if (colorDropdown && colorButton && 
                    !colorDropdown.contains(event.target as Node) && 
                    !colorButton.contains(event.target as Node)) {
                    colorDropdownVisible = false;
                }
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClickOutside);
        };
    });

    onDestroy(() => {
        editor?.destroy();
    });
</script>

<div id="editor" class="notion-editor"></div>

<div id="bubble-menu" class="notion-bubble-menu" role="toolbar" aria-label="formatting toolbar">
    <!-- Text formatting buttons -->
    <button
        onclick={() => editor?.chain().focus().toggleBold().run()}
        class="notion-button"
        class:notion-button-active={editor?.isActive('bold')}
        aria-label="Bold"
        title="Bold"
    >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
        </svg>
    </button>
    
    <button
        onclick={() => editor?.chain().focus().toggleItalic().run()}
        class="notion-button"
        class:notion-button-active={editor?.isActive('italic')}
        aria-label="Italic"
        title="Italic"
    >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"/>
            <line x1="14" y1="20" x2="5" y2="20"/>
            <line x1="15" y1="4" x2="9" y2="20"/>
        </svg>
    </button>
    
    <button
        onclick={() => editor?.chain().focus().toggleStrike().run()}
        class="notion-button"
        class:notion-button-active={editor?.isActive('strike')}
        aria-label="Strikethrough"
        title="Strikethrough"
    >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4H9a3 3 0 0 0-2.83 4"/>
            <path d="M14 12a4 4 0 0 1 0 8H6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
        </svg>
    </button>
    
    <button
        onclick={() => editor?.chain().focus().toggleCode().run()}
        class="notion-button"
        class:notion-button-active={editor?.isActive('code')}
        aria-label="Code"
        title="Code"
    >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16,18 22,12 16,6"/>
            <polyline points="8,6 2,12 8,18"/>
        </svg>
    </button>
    
    <div class="notion-separator"></div>
    
    <button 
        class="notion-button notion-color-button" 
        aria-label="Text color"
        title="Text color"
        onclick={() => colorDropdownVisible = !colorDropdownVisible}
    >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="13.5" cy="6.5" r=".5"/>
            <circle cx="17.5" cy="10.5" r=".5"/>
            <circle cx="8.5" cy="7.5" r=".5"/>
            <circle cx="6.5" cy="11.5" r=".5"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
    </button>
</div>

{#if colorDropdownVisible}
    <!-- Notion-style Color Dropdown -->
    <div class="notion-color-menu" id="color-menu">
        <div class="notion-color-section">
            <div class="notion-color-label">Colors</div>
            <div class="notion-color-grid">
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().unsetColor().run(); colorDropdownVisible = false; }}
                    title="Default"
                >
                    <div class="notion-color-preview default"></div>
                    <span>Default</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setColor('#9B9A97').run(); colorDropdownVisible = false; }}
                    title="Gray"
                >
                    <div class="notion-color-preview" style="color: #9B9A97;">A</div>
                    <span>Gray</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setColor('#D9730D').run(); colorDropdownVisible = false; }}
                    title="Orange"
                >
                    <div class="notion-color-preview" style="color: #D9730D;">A</div>
                    <span>Orange</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setColor('#DFAB01').run(); colorDropdownVisible = false; }}
                    title="Yellow"
                >
                    <div class="notion-color-preview" style="color: #DFAB01;">A</div>
                    <span>Yellow</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setColor('#0F7B6C').run(); colorDropdownVisible = false; }}
                    title="Green"
                >
                    <div class="notion-color-preview" style="color: #0F7B6C;">A</div>
                    <span>Green</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setColor('#0B6E99').run(); colorDropdownVisible = false; }}
                    title="Blue"
                >
                    <div class="notion-color-preview" style="color: #0B6E99;">A</div>
                    <span>Blue</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setColor('#6940A5').run(); colorDropdownVisible = false; }}
                    title="Purple"
                >
                    <div class="notion-color-preview" style="color: #6940A5;">A</div>
                    <span>Purple</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setColor('#AD1A72').run(); colorDropdownVisible = false; }}
                    title="Pink"
                >
                    <div class="notion-color-preview" style="color: #AD1A72;">A</div>
                    <span>Pink</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setColor('#E03E3E').run(); colorDropdownVisible = false; }}
                    title="Red"
                >
                    <div class="notion-color-preview" style="color: #E03E3E;">A</div>
                    <span>Red</span>
                </button>
            </div>
        </div>
        
        <div class="notion-color-section">
            <div class="notion-color-label">Backgrounds</div>
            <div class="notion-color-grid">
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().unsetHighlight().run(); colorDropdownVisible = false; }}
                    title="Default background"
                >
                    <div class="notion-color-preview default-bg"></div>
                    <span>Default</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setHighlight({ color: '#F1F1EF' }).run(); colorDropdownVisible = false; }}
                    title="Gray background"
                >
                    <div class="notion-color-preview" style="background: #F1F1EF;">A</div>
                    <span>Gray</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setHighlight({ color: '#FAEBCC' }).run(); colorDropdownVisible = false; }}
                    title="Orange background"
                >
                    <div class="notion-color-preview" style="background: #FAEBCC;">A</div>
                    <span>Orange</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setHighlight({ color: '#FFF2CD' }).run(); colorDropdownVisible = false; }}
                    title="Yellow background"
                >
                    <div class="notion-color-preview" style="background: #FFF2CD;">A</div>
                    <span>Yellow</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setHighlight({ color: '#DDEDEA' }).run(); colorDropdownVisible = false; }}
                    title="Green background"
                >
                    <div class="notion-color-preview" style="background: #DDEDEA;">A</div>
                    <span>Green</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setHighlight({ color: '#DDEBF1' }).run(); colorDropdownVisible = false; }}
                    title="Blue background"
                >
                    <div class="notion-color-preview" style="background: #DDEBF1;">A</div>
                    <span>Blue</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setHighlight({ color: '#EAE4F2' }).run(); colorDropdownVisible = false; }}
                    title="Purple background"
                >
                    <div class="notion-color-preview" style="background: #EAE4F2;">A</div>
                    <span>Purple</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setHighlight({ color: '#F4DFEB' }).run(); colorDropdownVisible = false; }}
                    title="Pink background"
                >
                    <div class="notion-color-preview" style="background: #F4DFEB;">A</div>
                    <span>Pink</span>
                </button>
                <button 
                    class="notion-color-item"
                    onclick={() => { editor?.chain().focus().setHighlight({ color: '#FBE4E4' }).run(); colorDropdownVisible = false; }}
                    title="Red background"
                >
                    <div class="notion-color-preview" style="background: #FBE4E4;">A</div>
                    <span>Red</span>
                </button>
            </div>
        </div>
    </div>
{/if}

{#if slashMenuVisible}
    <div 
        class="slash-menu"
        style="top: {slashMenuPosition.top + 24}px; left: {slashMenuPosition.left}px;"
    >
        <div class="slash-menu-header">
            <span class="slash-menu-title">BASIC BLOCKS</span>
        </div>
        {#each commands as { title, description, icon, command }, index}
            <button
                class="slash-menu-item {index === selectedCommandIndex ? 'selected' : ''}"
                onclick={() => executeCommand(command)}
            >
                <div class="slash-menu-icon">
                    {icon}
                </div>
                <div class="slash-menu-content">
                    <div class="slash-menu-item-title">{title}</div>
                    <div class="slash-menu-item-description">{description}</div>
                </div>
            </button>
        {/each}
    </div>
{/if}<style>
    /* Clean Notion-like editor styling */
    :global(.notion-editor) {
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: rgb(55, 53, 47);
        border: none;
        outline: none;
        padding: 0 0 0 96px; /* Left padding for drag handles - increased */
        margin: 0;
        min-height: 400px;
        position: relative;
    }

    /* Remove focus outlines */
    :global(.notion-editor:focus),
    :global(.notion-editor *:focus),
    :global(.ProseMirror:focus) {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
    }

    /* Notion Typography - Exact sizes */
    :global(.notion-editor h1) {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        margin: 2px 0 1px 0;
        color: rgb(55, 53, 47);
    }

    :global(.notion-editor h2) {
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.2;
        margin: 1px 0 1px 0;
        color: rgb(55, 53, 47);
    }

    :global(.notion-editor h3) {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.3;
        margin: 1px 0 1px 0;
        color: rgb(55, 53, 47);
    }

    :global(.notion-editor p) {
        margin: 1px 0;
        line-height: 1.5;
        color: rgb(55, 53, 47);
    }

    /* Empty paragraph placeholder - Notion style */
    :global(.notion-editor .is-editor-empty:first-child::before) {
        content: attr(data-placeholder);
        float: left;
        color: rgba(55, 53, 47, 0.375);
        pointer-events: none;
        height: 0;
        font-weight: 400;
    }

    :global(.notion-editor .ProseMirror p.is-empty::before) {
        content: "Type '/' for commands";
        float: left;
        color: rgba(55, 53, 47, 0.375);
        pointer-events: none;
        height: 0;
        font-weight: 400;
    }

    /* Notion-style Lists */
    :global(.notion-editor ul:not([data-type="taskList"]), .notion-editor ol) {
        margin: 1px 0;
        padding: 0;
        list-style: none;
    }

    :global(.notion-editor ul:not([data-type="taskList"]) li, .notion-editor ol li) {
        margin: 1px 0;
        padding: 0 0 0 1.6rem;
        position: relative;
        line-height: 1.5;
        display: list-item;
    }

    /* Bullet points - improved */
    :global(.notion-editor ul:not([data-type="taskList"]) li::before) {
        content: '•';
        position: absolute;
        left: 0.75rem;
        color: rgb(55, 53, 47);
        font-weight: 600;
        font-size: 1.1rem;
        line-height: 1.5;
        top: 0;
    }

    /* Numbers for ordered lists */
    :global(.notion-editor ol) {
        counter-reset: list-counter;
    }

    :global(.notion-editor ol li) {
        counter-increment: list-counter;
    }

    :global(.notion-editor ol li::before) {
        content: counter(list-counter) '.';
        position: absolute;
        left: 0;
        color: rgb(55, 53, 47);
        font-weight: 400;
        font-size: 1rem;
        line-height: 1.5;
        top: 0;
        min-width: 1.5rem;
    }

    /* Nested lists */
    :global(.notion-editor ul:not([data-type="taskList"]) ul, .notion-editor ol ol) {
        margin: 0;
        padding-left: 1.6rem;
    }

    :global(.notion-editor ul:not([data-type="taskList"]) ul li::before) {
        content: '◦';
        font-size: 1rem;
    }

    :global(.notion-editor ul:not([data-type="taskList"]) ul ul li::before) {
        content: '▪';
        font-size: 0.9rem;
    }

    /* Blockquotes */
    :global(.notion-editor blockquote) {
        border-left: 3px solid rgb(55, 53, 47);
        margin: 4px 0;
        padding: 2px 0 2px 14px;
        color: rgb(55, 53, 47);
        font-size: 1rem;
    }

    /* Horizontal Rules */
    :global(.notion-editor hr) {
        border: none;
        height: 1px;
        background: rgba(55, 53, 47, 0.09);
        margin: 6px 0;
    }

    /* Code blocks */
    :global(.notion-editor pre) {
        background: rgb(247, 246, 243);
        border-radius: 3px;
        padding: 16px;
        margin: 4px 0;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        font-size: 14px;
        line-height: 1.4;
        overflow-x: auto;
        border: 1px solid rgba(55, 53, 47, 0.16);
    }

    :global(.notion-editor pre code) {
        background: none;
        padding: 0;
        font-family: inherit;
        font-size: inherit;
        color: rgb(55, 53, 47);
    }

    /* Inline code */
    :global(.notion-editor code) {
        background: rgba(135, 131, 120, 0.15);
        color: #EB5757;
        border-radius: 3px;
        font-size: 85%;
        padding: 0.2em 0.4em;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    }

    /* Text formatting - colors and highlights */
    :global(.notion-editor mark) {
        background-color: rgba(255, 212, 0, 0.14);
        border-radius: 3px;
        box-decoration-break: clone;
        padding: 0.125rem 0.25rem;
    }

    /* Support for different highlight colors */
    :global(.notion-editor mark[data-color="yellow"]) {
        background-color: rgba(255, 212, 0, 0.14);
    }

    :global(.notion-editor mark[data-color="blue"]) {
        background-color: rgba(46, 170, 220, 0.2);
    }

    :global(.notion-editor mark[data-color="red"]) {
        background-color: rgba(235, 87, 87, 0.2);
    }

    :global(.notion-editor mark[data-color="green"]) {
        background-color: rgba(68, 131, 97, 0.2);
    }

    :global(.notion-editor mark[data-color="purple"]) {
        background-color: rgba(144, 101, 176, 0.2);
    }

    /* Task Lists - Sélecteurs corrects pour TipTap */
    :global(.notion-editor ul[data-type="taskList"]) {
        list-style: none !important;
        padding: 0 !important;
        margin: 1px 0 !important;
    }

    :global(.notion-editor ul[data-type="taskList"] li) {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        gap: 8px !important;
        margin: 1px 0 !important;
        padding: 0 !important;
        list-style: none !important;
        line-height: 1.5 !important;
        position: relative !important;
        min-height: 20px !important;
    }

    :global(.notion-editor ul[data-type="taskList"] li > label) {
        display: block !important;
        cursor: pointer !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.5 !important;
        flex-shrink: 0 !important;
        width: auto !important;
        float: none !important;
    }

    :global(.notion-editor ul[data-type="taskList"] li > div) {
        flex: 1 !important;
        line-height: 1.5 !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
        width: auto !important;
        float: none !important;
    }

    :global(.notion-editor ul[data-type="taskList"] li input[type="checkbox"]) {
        width: 16px !important;
        height: 16px !important;
        margin: 0 !important;
        border: 1px solid rgba(55, 53, 47, 0.25) !important;
        border-radius: 3px !important;
        background: white !important;
        cursor: pointer !important;
        appearance: none !important;
        flex-shrink: 0 !important;
        transition: all 0.1s ease !important;
        position: relative !important;
        z-index: 1 !important;
        margin-top: 2px !important;
        display: inline-block !important;
        vertical-align: top !important;
        float: none !important;
    }

    /* Hide the empty span in the label */
    :global(.notion-editor ul[data-type="taskList"] li label span) {
        display: none !important;
    }

    :global(.notion-editor ul[data-type="taskList"] li input[type="checkbox"]:hover) {
        background: rgba(55, 53, 47, 0.05) !important;
    }

    :global(.notion-editor ul[data-type="taskList"] li input[type="checkbox"]:checked) {
        background: rgb(46, 170, 220) !important;
        border-color: rgb(46, 170, 220) !important;
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e") !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: 12px !important;
    }

    /* Style pour le texte barré */
    :global(.notion-editor ul[data-type="taskList"] li[data-checked="true"] > div),
    :global(.notion-editor ul[data-type="taskList"] li[data-checked="true"] > div > p) {
        text-decoration: line-through !important;
        color: rgba(55, 53, 47, 0.375) !important;
    }

    /* Ensure text content has proper spacing */
    :global(.notion-editor ul[data-type="taskList"] li > div > p) {
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.5 !important;
        display: inline !important;
    }

    /* Block hover effects - very subtle like Notion */
    :global(.notion-editor p:hover),
    :global(.notion-editor h1:hover),
    :global(.notion-editor h2:hover),
    :global(.notion-editor h3:hover),
    :global(.notion-editor blockquote:hover),
    :global(.notion-editor li:hover),
    :global(.notion-editor pre:hover) {
        background-color: rgba(55, 53, 47, 0.04);
        border-radius: 3px;
        transition: background-color 0.1s ease;
    }

    :global(.notion-editor .ProseMirror-selectednode) {
        outline: none !important;
    }

    /* Drag Handle - Exact Notion style */
    :global(.notion-drag-handle) {
        position: absolute;
        left: -96px;
        top: 1px;
        width: 46px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: rgba(55, 53, 47, 0.4);
        cursor: grab;
        opacity: 0;
        transition: opacity 0.1s ease, background-color 0.1s ease;
        border-radius: 4px;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        font-weight: 400;
        user-select: none;
        margin-right: 4px;
        z-index: 10;
    }

    /* Show drag handle on block hover - Fixed selectors */
    :global(.notion-editor p:hover .notion-drag-handle),
    :global(.notion-editor h1:hover .notion-drag-handle),
    :global(.notion-editor h2:hover .notion-drag-handle),
    :global(.notion-editor h3:hover .notion-drag-handle),
    :global(.notion-editor li:hover .notion-drag-handle),
    :global(.notion-editor blockquote:hover .notion-drag-handle),
    :global(.notion-editor pre:hover .notion-drag-handle),
    :global(.notion-editor .notion-drag-handle:hover) {
        opacity: 1 !important;
    }

    :global(.notion-drag-handle:hover) {
        background: rgba(55, 53, 47, 0.08);
        color: rgba(55, 53, 47, 0.6);
    }

    :global(.notion-drag-handle:active) {
        cursor: grabbing;
        background: rgba(55, 53, 47, 0.12);
    }

    /* Drop cursor */
    :global(.ProseMirror-dropcursor) {
        border-left: 2px solid rgb(46, 170, 220) !important;
        border-radius: 0 !important;
        margin-left: -1px !important;
    }

    /* Slash Menu - Exact Notion styling */
    .slash-menu {
        position: fixed;
        z-index: 1000;
        background: white;
        border-radius: 6px;
        box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
        padding: 8px 0;
        min-width: 288px;
        max-height: 280px;
        overflow-y: auto;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }

    .slash-menu-header {
        padding: 6px 14px 2px 14px;
        margin-bottom: 4px;
    }

    .slash-menu-title {
        font-size: 11px;
        font-weight: 500;
        color: rgba(55, 53, 47, 0.65);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .slash-menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 6px 14px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.1s ease;
        border-radius: 0;
        gap: 10px;
    }

    .slash-menu-item:hover,
    .slash-menu-item.selected {
        background: rgba(55, 53, 47, 0.08);
    }

    .slash-menu-icon {
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
        color: rgba(55, 53, 47, 0.65);
    }

    .slash-menu-content {
        flex: 1;
        min-width: 0;
    }

    .slash-menu-item-title {
        font-size: 14px;
        font-weight: 500;
        color: rgb(55, 53, 47);
        line-height: 1.4;
        margin-bottom: 1px;
    }

    .slash-menu-item-description {
        font-size: 12px;
        color: rgba(55, 53, 47, 0.65);
        line-height: 1.3;
    }

    /* Scrollbar styling for slash menu */
    .slash-menu::-webkit-scrollbar {
        width: 4px;
    }

    .slash-menu::-webkit-scrollbar-track {
        background: transparent;
    }

    .slash-menu::-webkit-scrollbar-thumb {
        background: rgba(55, 53, 47, 0.16);
        border-radius: 2px;
    }

    .slash-menu::-webkit-scrollbar-thumb:hover {
        background: rgba(55, 53, 47, 0.24);
    }

    /* Syntax highlighting - Notion colors */
    :global(.notion-editor .hljs-keyword) { color: #D73A49; }
    :global(.notion-editor .hljs-string) { color: #032F62; }
    :global(.notion-editor .hljs-number) { color: #005CC5; }
    :global(.notion-editor .hljs-comment) { color: #6A737D; font-style: italic; }
    :global(.notion-editor .hljs-function) { color: #6F42C1; }
    :global(.notion-editor .hljs-variable) { color: #E36209; }
    :global(.notion-editor .hljs-attr) { color: #005CC5; }
    :global(.notion-editor .hljs-title) { color: #6F42C1; }
    :global(.notion-editor .hljs-tag) { color: #22863A; }
    :global(.notion-editor .hljs-built_in) { color: #005CC5; }

    /* Notion-style Bubble Menu */
    .notion-bubble-menu {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
        padding: 6px;
        display: flex;
        align-items: center;
        gap: 2px;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        border: 1px solid rgba(0, 0, 0, 0.05);
        position: relative;
        z-index: 1000;
    }

    .notion-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        background: none;
        border-radius: 4px;
        cursor: pointer;
        color: rgba(55, 53, 47, 0.6);
        transition: all 0.2s ease;
        padding: 0;
    }

    .notion-button:hover {
        background: rgba(55, 53, 47, 0.08);
        color: rgb(55, 53, 47);
    }

    .notion-button-active {
        background: rgba(35, 131, 226, 0.28);
        color: rgb(35, 131, 226);
    }

    .notion-button-active:hover {
        background: rgba(35, 131, 226, 0.35);
    }

    .notion-separator {
        width: 1px;
        height: 20px;
        background: rgba(55, 53, 47, 0.16);
        margin: 0 4px;
    }

    /* Notion Color Menu */
    .notion-color-menu {
        position: fixed;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
        padding: 8px;
        z-index: 1001;
        min-width: 240px;
        max-width: 280px;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .notion-color-section {
        margin-bottom: 12px;
    }

    .notion-color-section:last-child {
        margin-bottom: 0;
    }

    .notion-color-label {
        font-size: 12px;
        font-weight: 500;
        color: rgba(55, 53, 47, 0.6);
        margin-bottom: 8px;
        padding: 0 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .notion-color-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
    }

    .notion-color-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border: none;
        background: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
        font-size: 13px;
        color: rgb(55, 53, 47);
        min-height: 32px;
    }

    .notion-color-item:hover {
        background: rgba(55, 53, 47, 0.06);
    }

    .notion-color-preview {
        width: 20px;
        height: 16px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 12px;
        flex-shrink: 0;
    }

    .notion-color-preview.default {
        border: 1px solid rgba(55, 53, 47, 0.2);
        background: white;
        color: rgb(55, 53, 47);
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notion-color-preview.default::before {
        content: 'A';
    }

    .notion-color-preview.default-bg {
        border: 1px solid rgba(55, 53, 47, 0.2);
        background: white;
        position: relative;
        overflow: hidden;
    }

    .notion-color-preview.default-bg::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 2px;
        height: 150%;
        background: rgba(55, 53, 47, 0.3);
    }

    .notion-color-item span {
        font-size: 13px;
        color: rgba(55, 53, 47, 0.8);
    }
</style>
