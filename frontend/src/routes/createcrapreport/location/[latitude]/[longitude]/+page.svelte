<script lang="ts">
    import { page } from '$app/state';
    $: latitude = page.params.latitude;
    $: longitude = page.params.longitude;
  </script>
  
  <h1>Create Crap Report for {latitude} {longitude}</h1>
  