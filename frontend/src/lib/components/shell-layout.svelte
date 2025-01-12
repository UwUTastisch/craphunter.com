<script lang="ts">
    import MapView from '$lib/components/map-view.svelte';

  </script>
  
  <!-- 
    We'll listen for "openLogin" from the nav bar 
    at this layout level. 
  -->
  <div class="shell-container relative w-full h-screen">
    <!-- The page content (like the map) goes here -->
    <div class="page-content float-left h-full w-full md:w-2/3">
      <MapView />
    </div>
  
    <!-- The side/bottom panel -->
    <div class="panel-container float-left w-full md:w-1/3 h-full border-l border-gray-300">
      <slot/>
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
  