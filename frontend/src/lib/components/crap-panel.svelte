<script lang="ts">
    import { pb } from '$lib/pocketbase';
    export let crapItem: any = null;
  
    $: imageUrl = (crapItem && crapItem.expand?.crap_report?.[0])
      ? pb.files.getUrl(crapItem.expand.crap_report[0], crapItem.expand.crap_report[0].image)
      : '';
  </script>
  
  {#if crapItem}
  <div class="p-4 bg-white text-black border rounded w-64">
    <img src={imageUrl} alt="Crap" class="mb-2" />
    <h3 class="font-bold">Crap #{crapItem.id}</h3>
    <p>Description: {crapItem.description}</p>
    <p>Latitude: {crapItem.latitude}</p>
    <p>Longitude: {crapItem.longitude}</p>
  </div>
  {/if}