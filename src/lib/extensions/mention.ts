import { Node, mergeAttributes } from '@tiptap/core'

export interface MentionOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mention: {
      setMention: (options: { text: string, url?: string }) => ReturnType
    }
  }
}

export const Mention = Node.create<MentionOptions>({
  name: 'mention',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      text: {
        default: null,
      },
      url: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[class="notion-mention"]',
        getAttrs: (element) => {
          if (typeof element === 'string') return null
          return {
            text: element.textContent,
            url: element.getAttribute('data-url'),
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        {
          class: 'notion-mention',
          'data-url': node.attrs.url,
          contenteditable: 'false',
        },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      node.attrs.text,
    ]
  },

  addCommands() {
    return {
      setMention: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-m': () => {
        // Trigger mention modal - this could be connected to your openMentionModal function
        return true
      },
    }
  },
})
