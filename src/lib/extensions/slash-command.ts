import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

export const SlashCommand = Extension.create({
    name: 'slash-command',

    addOptions() {
        return {
            commands: [],
            onOpen: () => {},
            onClose: () => {},
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('slash-command'),
                props: {
                    handleKeyDown: (view, event) => {
                        if (event.key === '/') {
                            const { state } = view;
                            const { $from } = state.selection;
                            
                            // Check if we're at the start of a block or the current line is empty
                            const isStartOfBlock = $from.parentOffset === 0;
                            const currentNode = $from.parent;
                            const isEmptyNode = currentNode.textContent.trim() === '';
                            
                            // Also check if we're after a space (Notion behavior)
                            const beforeSlash = state.doc.textBetween(Math.max(0, $from.pos - 1), $from.pos);
                            const isAfterSpace = beforeSlash === ' ' || beforeSlash === '';
                            
                            if (isStartOfBlock || isEmptyNode || isAfterSpace) {
                                // Store the position where the slash will be inserted
                                const slashPos = $from.pos;
                                
                                // Allow the '/' to be inserted first, then open menu
                                setTimeout(() => {
                                    this.options.onOpen?.(slashPos + 1, slashPos);
                                }, 10);
                                return false; // Allow the '/' to be inserted
                            }
                        }

                        return false;
                    },
                },
            }),
        ];
    },
});