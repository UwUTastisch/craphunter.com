<script lang="ts">
    import SidePanel from '$lib/components/side-panel.svelte';
    import { onMount } from 'svelte';
  
    export let user: { user: string, nickname: string | null } | null = null; // e.g., { user: { userID, nickname } } or null; // from layout
    let panelMode: 'idle' | 'login' | 'showCrap' | 'createCrap' = 'idle';
    let selectedCrap: any = null;
    let newLatLng: { lat: number; lng: number } | null = null;
  
    // If user is not logged in => show login by default
    $: if (!user) {
      panelMode = 'login';
    }
  
    function handleOpenLogin() {
      // This event is dispatched from nav-bar
      panelMode = 'login';
      selectedCrap = null;
      newLatLng = null;
    }
  
    // The side-panel can call panelReset to close or revert
    function resetPanel() {
      if (!user) {
        // If not logged in, remain in login mode
        panelMode = 'login';
      } else {
        panelMode = 'idle';
      }
      selectedCrap = null;
      newLatLng = null;
    }
  
    // We won't override map clicks here, because the map is in the page.
    // If you want to handle map clicks here, you'd do events. But let's keep it simpler for now.
  </script>
  
  <!-- 
    We'll listen for "openLogin" from the nav bar 
    at this layout level. 
  -->
  <div
    class="shell-container relative w-full h-screen"
    on:openLogin={handleOpenLogin}
  >
    <!-- The page content (like the map) goes here -->
    <div class="page-content float-left h-full w-full md:w-2/3">
      <slot />
    </div>
  
    <!-- The side/bottom panel -->
    <div class="panel-container float-left w-full md:w-1/3 h-full border-l border-gray-300">
      <SidePanel
        {user}
        mode={panelMode}
        {selectedCrap}
        {newLatLng}
        on:panelReset={resetPanel}
      />
    </div>
  </div>
  
  <style>
  /* For smaller screens or portrait, side panel at bottom if you like. 
     Example approach is to do a media query. Or keep it simpler if you want. */
  @media (orientation: portrait) {
    .page-content {
      width: 100%;
      height: 60%;
    }
    .panel-container {
      width: 100%;
      height: 40%;
      border-left: none;
      border-top: 1px solid #ccc;
    }
  }
  </style>
  