<script lang="ts">
    import AuthForm from '$lib/components/auth-form.svelte';
    import { createEventDispatcher } from 'svelte';
  
    export let user;
    export let mode: 'idle' | 'login' | 'showCrap' | 'createCrap';
    export let selectedCrap: any = null;
    export let newLatLng: { lat: number; lng: number } | null = null;
  
    const dispatch = createEventDispatcher();
  
    $: isLoggedIn = !!user;
  
    function panelReset() {
      dispatch('panelReset');
    }
  </script>
  
  <div class="w-full h-full overflow-y-auto">
    {#if mode === 'login'}
      <AuthForm on:done={panelReset} />
    {:else if mode === 'showCrap' && selectedCrap}
      <!-- If you want to show crap details, you can put that here. -->
      <div class="p-4">
        <h3 class="font-bold mb-2">Crap #{selectedCrap.id}</h3>
        <p>Description: {selectedCrap.description}</p>
        <button
          class="mt-4 bg-gray-600 text-white px-3 py-1"
          on:click={panelReset}
        >
          Close
        </button>
      </div>
    {:else if mode === 'createCrap' && newLatLng && isLoggedIn}
      <!-- A create form if user is logged in. 
           If you want the map to handle creation, fine. 
           But here's an example:
      -->
      <div class="p-4">
        <h3 class="font-bold mb-2">Create New Crap</h3>
        <p>Lat: {newLatLng.lat}, Lng: {newLatLng.lng}</p>
        <!-- ... form stuff ... -->
        <button class="bg-gray-400 text-white px-3 py-1" on:click={panelReset}>Cancel</button>
      </div>
    {:else}
      <!-- idle or fallback -->
      <div class="p-4 text-gray-600 text-sm">
        {#if isLoggedIn}
          <p>Logged in! Interact with the map or items as needed.</p>
        {:else}
          <p>Please login to interact with crap. You can still view the map publicly.</p>
        {/if}
      </div>
    {/if}
  </div>
  