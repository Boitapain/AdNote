<script lang="ts">
    import { invalidate } from "$app/navigation";
    import type { Session, SupabaseClient } from "@supabase/supabase-js";
    import type { Notes } from "$lib/types";

    let { 
        session, 
        supabase, 
        notes = [] 
    }: { 
        session: Session | null; 
        supabase: SupabaseClient; 
        notes?: Notes; 
    } = $props();

    async function handleSignOut() {
        await supabase?.auth?.signOut();
        await invalidate("supabase:auth");
        location.href = "/";
    }

    function handleSignIn() {
        location.href = "/auth";
    }
</script>

<div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
        {#if session}
            <div class="dropdown">
                <div
                    tabindex="0"
                    role="button"
                    class="btn btn-ghost btn-circle"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h7"
                        />
                    </svg>
                </div>
                <ul
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-64 p-2 shadow max-h-96 overflow-y-auto"
                >
                    <!-- Bouton Home -->
                    <li>
                        <a href="/" class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </a>
                    </li>

                    <li class="menu-title">
                        <div class="flex items-center justify-between w-full group">
                            <span class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Documents
                            </span>
                            <button 
                                class="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Créer un nouveau document"
                                aria-label="Créer un nouveau document"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </li>

                    <!-- Liste des documents/notes -->
                    {#each notes as note (note.id)}
                        <li>
                            <a href="/dashboard" class="text-sm flex items-center gap-2 pl-6">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span class="truncate">{note.note.slice(0, 30)}{note.note.length > 30 ? '...' : ''}</span>
                            </a>
                        </li>
                    {/each}

                    {#if notes.length === 0}
                        <li class="pl-6">
                            <span class="text-sm text-base-content/60 italic">Aucun document</span>
                        </li>
                    {/if}

                    <div class="divider my-1"></div>

                    <!-- Lien vers le calendrier -->
                    <li>
                        <a href="/calendar" class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Calendrier
                        </a>
                    </li>
                </ul>
            </div>
        {/if}
        <div class="flex-1">
            <a href="/" class="font-bold flex text-xl">
                <img
                    src="/favicon.png"
                    alt="Logo"
                    class="w-8 h-8 mr-2"
                />
                AdNote
            </a>
        </div>
    </div>

    <div class="navbar-end">
        {#if session}
            <div class="dropdown dropdown-end">
                <button tabindex="0" class="btn btn-ghost btn-sm gap-2">
                    <div>
                        <div
                            class="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center"
                        >
                            {#if session.user?.email}
                                {session.user.email
                                    .slice(0, 1)
                                    .toUpperCase()}
                            {:else}
                                U
                            {/if}
                        </div>
                    </div>
                    <span class="hidden sm:inline"
                        >{session.user?.email ?? "Utilisateur"}</span
                    >
                </button>
                <ul
                    class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                    <li><a href="/profile">Profil</a></li>
                    <li>
                        <button onclick={handleSignOut}
                            >Se déconnecter</button
                        >
                    </li>
                </ul>
            </div>
        {:else}
            <button
                onclick={handleSignIn}
                class="btn btn-primary btn-sm">Se connecter</button
            >
        {/if}
    </div>
</div>
