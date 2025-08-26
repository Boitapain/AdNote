<script lang="ts">
    import Navbar from "$lib/components/Navbar.svelte";
    import type { Snippet } from "svelte";
    
    let { data, children }: { 
        data: any; 
        children: Snippet;
    } = $props();
    
    let { session, supabase, notes = [] } = $derived(data);
</script>

<!-- Layout avec navbar pour les pages privées -->
<div class="drawer drawer-mobile">
    <div class="drawer-content flex flex-col min-h-screen">
        <Navbar {session} {supabase} {notes} />
        
        <!-- page content -->
        <div class="flex-1">
            {@render children()}
        </div>
    </div>
</div>