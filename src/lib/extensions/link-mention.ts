import { Mark, mergeAttributes } from '@tiptap/core'

export interface LinkMentionOptions {
    HTMLAttributes: Record<string, any>
    protocols: string[]
    openOnClick: boolean
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        linkMention: {
            setLinkMention: (attributes: { href: string, title?: string }) => ReturnType
            unsetLinkMention: () => ReturnType
        }
    }
}

export const LinkMention = Mark.create<LinkMentionOptions>({
    name: 'linkMention',

    addOptions() {
        return {
            HTMLAttributes: {},
            protocols: [],
            openOnClick: true,
        }
    },

    addAttributes() {
        return {
            href: {
                default: null,
            },
            title: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'a[href]:not([href *= "javascript:" i])',
                getAttrs: (element) => {
                    if (typeof element === 'string') return null
                    const href = element.getAttribute('href')

                    if (!href) return false

                    // Extract domain name for display
                    try {
                        const url = new URL(href)
                        const domain = url.hostname.replace('www.', '')
                        return {
                            href,
                            title: element.textContent || domain,
                        }
                    } catch {
                        return {
                            href,
                            title: element.textContent || href,
                        }
                    }
                },
            },
        ]
    },

    renderHTML({ mark, HTMLAttributes }) {
        const { href, title } = mark.attrs

        // Extract domain for display
        let displayText = title
        if (!title || title === href) {
            try {
                const url = new URL(href)
                displayText = url.hostname.replace('www.', '')
            } catch {
                displayText = href
            }
        }

        return [
            'a',
            mergeAttributes(
                {
                    href: href,
                    class: 'notion-link',
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
                this.options.HTMLAttributes,
                HTMLAttributes,
            ),
            displayText,
        ]
    },

    addCommands() {
        return {
            setLinkMention: (attributes) => ({ chain }) => {
                return chain().setMark(this.name, attributes).run()
            },

            unsetLinkMention: () => ({ chain }) => {
                return chain().unsetMark(this.name, { extendEmptyMarkRange: true }).run()
            },
        }
    },

    addKeyboardShortcuts() {
        return {
            'Mod-k': () => {
                // This could trigger the link modal
                return true
            },
        }
    },
})
