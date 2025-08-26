<script lang="ts">
    let { data } = $props();
    let { notes = [] } = $derived(data);
    
    // Simulation des prochains événements
    const upcomingEvents = [
        { title: "Réunion équipe", date: "Demain 14h00" },
        { title: "Présentation client", date: "Vendredi 10h30" },
        { title: "Formation TypeScript", date: "Lundi 9h00" },
        { title: "Review code", date: "Mardi 16h00" },
        { title: "Planning sprint", date: "Mercredi 11h00" }
    ];
</script>

<div class="min-h-screen bg-base-200 p-8">
    <div class="max-w-4xl mx-auto space-y-8">
        <!-- Section Documents -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold">Vos Documents</h2>
                <button class="btn btn-primary">+ Nouveau</button>
            </div>
            
            <div class="space-y-3">
                {#each notes.slice(0, 5) as note}
                    <div class="card bg-base-100 shadow-lg">
                        <div class="card-body p-4">
                            <p class="truncate">{note.note}</p>
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
