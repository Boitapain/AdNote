<script lang="ts">
    import Editor from "$lib/components/Editor.svelte";

    export let data; // Data passed from +page.server.ts

    let notes = data.notes || []; // Assuming `notes` is passed from the server

    let title = data.note.title || "Untitled"; // Note title
    let content = typeof data.note.content === "string"
        ? data.note.content
        : JSON.stringify(data.note.content || ""); // Ensure content is a string

    // Save the title to the server
    async function saveTitle() {
        await fetch(`/editor/${data.note.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });

        // Update the title in the notes array
        const note = notes.find((note) => note.id === data.note.id);
        if (note) {
            note.title = title;
        }
    }

    // Save the content to the server
    async function saveContent(updatedContent: string) {
        await fetch(`/editor/${data.note.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: updatedContent }),
        });
    }
</script>

<div class="notion-page-container">
    <div class="notion-page">
        <!-- Editable Title -->
        <input
            type="text"
            bind:value={title}
            on:input={saveTitle}
            placeholder="Untitled"
            class="notion-title"
        />

        <!-- Tiptap Editor -->
        <Editor content={content} onUpdate={saveContent} />
    </div>
</div>

<style>
    .notion-page-container {
        min-height: calc(100vh - 64px); /* Account for navbar height */
        background: white;
        display: flex;
        justify-content: center;
        padding: 0;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }

    .notion-page {
        width: 100%;
        max-width: 900px; /* Plus large comme Notion */
        padding: 96px 96px 30vh 96px;
        position: relative;
        background: white;
        min-height: calc(100vh - 64px); /* Account for navbar height */
    }

    .notion-title {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        color: rgb(55, 53, 47);
        border: none;
        background: transparent;
        outline: none;
        width: 100%;
        padding: 3px 2px;
        margin: 0 0 8px 94px;
        resize: none;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
        transition: background-color 0.1s ease;
    }

    .notion-title:hover {
        background-color: rgba(55, 53, 47, 0.04);
        border-radius: 3px;
    }

    .notion-title::placeholder {
        color: rgba(55, 53, 47, 0.375);
    }

    .notion-title:focus {
        outline: none;
    }

    /* Responsive design - Exactly like Notion */
    @media (max-width: 1024px) {
        .notion-page {
            padding: 96px 60px 30vh 60px;
        }
    }

    @media (max-width: 768px) {
        .notion-page {
            padding: 48px 24px 30vh 24px;
        }
        
        .notion-title {
            font-size: 2rem;
            margin-left: 94px;
        }
    }

    @media (max-width: 480px) {
        .notion-page {
            padding: 32px 16px 30vh 16px;
        }
        
        .notion-title {
            font-size: 1.75rem;
            margin-left: 94px;
        }
    }
</style>