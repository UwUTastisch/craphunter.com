<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    $: crapid = page.params.crapid;

    import CreateCrapReportView from '$lib/components/createcrapreport-view.svelte';

    import { pb } from '$lib/pocketbase';

    $: crapRecord = null;

    async function loadRecord() {
        crapRecord = (await pb.collection('crap').getOne(crapid, {
            expand: "crap_report",
        }));
    }

    onMount(async () => {
        await loadRecord();

        console.log(crapRecord);
    });
  </script>
  
  <h1>Create Crap Report for ID: {crapid}</h1>
  
  {#if crapRecord}
    <CreateCrapReportView latitude=null longitude=null {crapRecord}/>
  {:else}
    <p>Loading...</p>
  {/if}