<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import type { Snippet } from "svelte";

    let { data, children }: { 
        data: import('./$types').LayoutData & { notes?: import('$lib/types').Notes }; 
        children: Snippet;
    } = $props();
    
    let { session, supabase, notes = [] } = $derived(data);

    // Debug: Check what root layout receives
    // $effect(() => {
    //     console.log('🏠 Root Layout - full data received:', data);
    //     console.log('🏠 Root Layout - notes:', notes);
    // });

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate("supabase:auth");
            }
        });

        return () => data.subscription.unsubscribe();
    });

    import "../app.css";
</script>

<!-- Layout minimal sans navbar -->
<div class="min-h-screen">
    {@render children()}
</div>
