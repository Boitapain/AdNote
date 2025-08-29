<script lang="ts">
    import type { Notes, Note } from '$lib/types';
    
    let { data }: { 
        data: any & { notes?: Notes }
    } = $props();
    let { notes = [] } = $derived(data);
    
    let noteToDelete = $state<Note | null>(null);
    
    // Debug: Log what we receive (reactive)
    // $effect(() => {
    //     console.log('🏠 Dashboard page - notes received:', notes);
    //     console.log('🏠 Dashboard page - full data:', data);
    // });
    
    // Simulation des prochains événements
    const upcomingEvents = [
        { title: "Réunion équipe", date: "Demain 14h00" },
        { title: "Présentation client", date: "Vendredi 10h30" },
        { title: "Formation TypeScript", date: "Lundi 9h00" },
        { title: "Review code", date: "Mardi 16h00" },
        { title: "Planning sprint", date: "Mercredi 11h00" }
    ];
</script>

<div class="min-h-screen bg-base-200 p-8 mt-16">
    <div class="max-w-4xl mx-auto space-y-8">
        <!-- Section Documents -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold">Vos Documents</h2>
                <form method="POST" action="/editor">
                    <button type="submit" class="btn btn-primary">+ Nouveau</button>
                </form>
            </div>
            
            <div class="space-y-3">
                {#each notes.slice(0, 5) as note}
                    <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow group">
                        <div class="card-body p-4">
                            <div class="flex justify-between items-center">
                                <a 
                                    href="/editor/{note.id}" 
                                    data-sveltekit-reload
                                    class="flex-1 cursor-pointer"
                                >
                                    <p class="truncate font-medium hover:text-primary transition-colors">
                                        {note.title?.trim() ? note.title : "New Document"}
                                    </p>
                                </a>
                                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a 
                                        href="/editor/{note.id}" 
                                        data-sveltekit-reload
                                        class="btn btn-ghost btn-sm"
                                        title="Ouvrir le document"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </a>
                                    <button
                                        type="button"
                                        class="btn btn-ghost btn-sm text-error"
                                        onclick={() => (noteToDelete = note)}
                                        title="Supprimer le document"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else}
                    {#each Array(5) as _}
                        <div class="card bg-base-100 shadow-lg">
                            <div class="card-body p-4">
                                <div class="skeleton h-4 w-full"></div>
                            </div>
                        </div>
                    {/each}
                {/each}
            </div>
        </div>

        <!-- Section Événements -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold">Vos prochains événements</h2>
                <button class="btn btn-primary">+ Nouveau</button>
            </div>
            
            <div class="space-y-3">
                {#each upcomingEvents as event}
                    <div class="card bg-base-100 shadow-lg">
                        <div class="card-body p-4">
                            <div class="flex justify-between items-center">
                                <h3 class="font-medium">{event.title}</h3>
                                <div class="badge badge-primary">{event.date}</div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

{#if noteToDelete}
    <dialog id="delete_modal" class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Supprimer le document ?</h3>
            <p class="py-4">
                Voulez-vous vraiment supprimer
                <span class="font-semibold">
                    "{noteToDelete.title || "New Document"}"
                </span>
                ?
            </p>
            <div class="modal-action">
                <button class="btn" onclick={() => (noteToDelete = null)}>
                    Annuler
                </button>
                <button
                    type="button"
                    class="btn btn-error"
                    onclick={async () => {
                        await fetch(`/editor/${noteToDelete?.id}`, {
                            method: "DELETE",
                        });
                        noteToDelete = null;
                        location.reload();
                    }}
                >
                    Supprimer
                </button>
            </div>
        </div>
    </dialog>
{/if}
