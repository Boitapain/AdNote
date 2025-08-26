<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import type { Notes } from '$lib/types';
    
    let { data }: { 
        data: any & { notes?: Notes }
    } = $props();
    let { session, supabase, notes = [] } = $derived(data);
</script>

<!-- Navbar pour la page d'accueil -->
<Navbar {session} {supabase} {notes} />

<section class="max-w-5xl mx-auto p-6">
    <div class="grid gap-6 md:grid-cols-5">
        <article class="md:col-span-3 card bg-base-300 p-6 shadow">
            <div class="card-body">
                <h2 class="card-title text-2xl">Prise de notes — style Notion</h2>
                <p class="text-sm opacity-80">
                    Organise tes idées, crée des blocs de contenu modulaires et structure tes pages comme dans Notion.
                    Ajoute des titres, listes, et retrouve rapidement tes notes grâce à une recherche simple.
                </p>
                <ul class="mt-4 space-y-2">
                    <li class="flex items-start gap-3">
                        <span class="badge badge-primary">•</span>
                        <span>Pages et sous-pages illimités</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="badge badge-primary">•</span>
                        <span>Edition rapide et collaboration (bientôt)</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="badge badge-primary">•</span>
                        <span>Organisation par tags et dossiers</span>
                    </li>
                </ul>
            </div>
        </article>

        <!-- 40% -->
        <aside class="md:col-span-2 card bg-base-300 p-6 shadow">
            <div class="card-body">
                <h3 class="text-xl font-semibold">Gestion de calendrier</h3>
                <p class="text-sm opacity-80">
                    Planifie tes tâches, crée des événements et synchronise tes rendez‑vous.
                    Un calendrier simple pour suivre tes deadlines et organiser tes journées.
                </p>

                <div class="mt-4">
                    <ul class="menu bg-base-100 rounded-box w-full p-2">
                        <li><a href="/calendar">Vue mensuelle</a></li>
                        <li><a href="/calendar">Vue hebdo</a></li>
                        <li><a href="/calendar">Rappels & notifications</a></li>
                    </ul>
                </div>
            </div>
        </aside>
    </div>

    <!-- CTA -->
    <div class="mt-8 text-center">
        {#if session}
            <a href="/dashboard" class="btn btn-primary btn-lg">Votre Dashboard</a>
        {:else}
            <a href="/auth" class="btn btn-primary btn-lg">Se connecter</a>
        {/if}
    </div>
</section>