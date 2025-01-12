<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  import CrapPanel from '$lib/components/crap-panel.svelte';

  import { pb } from '$lib/pocketbase';

  $: crapid = page.params.crapid;

  $: crapItem = null;

  async function loadRecord() {
    crapItem = (await pb.collection('crap').getOne(crapid, {
      expand: "crap_report",
    }));
  }
  
  onMount(async () => {
    await loadRecord();

    console.log(crapItem);
  });

</script>
  
<h1>Viewing crap with ID #{crapid}</h1>

{#if crapItem}
  <CrapPanel {crapItem}/>
{:else}
  <p>Loading...</p>
{/if}
  