<script lang="ts">


import { pb } from '$lib/pocketbase';
import { user } from '$lib/shared.svelte';

let { latitude, longitude, crapRecord} = $props();


/*
crapReport data structure
const data = {
    "user": "RELATION_RECORD_ID",
    "status": "FIRST_SEEN",
    "description": "test",
    "tags": [
        "RELATION_RECORD_ID"
    ]
};
*/
const crapReport = $state({
    user: "RELATION_RECORD_ID",
    status: "FIRST_SEEN",
    description: "test",
    tags: [
        "l6uj93z08188k7b"
    ]
});


const crap = $state({
    description: '', // will be updated by user input
    latitude: latitude, // not for user input
    longitude: longitude, // not for user input
    crap_report: [""] // not for user input
});

async function createCrapReport() {
    if (!user.user) {
        console.log('User not logged in');
        return;
    }
    crapReport.user = user.user.userID;
    const crapReportRecord = await pb.collection('crap_report').create(crapReport);
    console.log('Creating crap report');

    if (!crapRecord) {
        crap.crap_report = [crapReportRecord.id];
        crap.description = crapReport.description;
        console.log('crapRecord is null, creating crap');
        
        crapRecord = await pb.collection('crap').create(crap);
        console.log('Creating crap');
    } else {
        crap.description = crapRecord.description;
        crap.latitude = crapRecord.latitude;
        crap.longitude = crapRecord.longitude;
        crap.crap_report = [crapReportRecord.id].concat(crapRecord.crap_report);
        console.log('crapRecord is not null, updating crap');
        crapRecord = await pb.collection('crap').update(crapRecord.id, crap);
    }
}
</script>


{#if user.user}
<form onsubmit="{createCrapReport}">
    <!-- description -->
    <div>
        <label for="description">Description:</label>
        <input id="description" type="text" bind:value={crapReport.description} />
    </div>
    <!-- Tags 
    {#if crapRecord}
        <div>
            <label for="tags">Tags:</label>
            <select id="tags" multiple>
                {#each crapRecord.tags as tag}
                    <option value={tag}>{tag}</option>
                {/each}
            </select>
        </div>
    {/if}
    <button type="button">Add Tag</button>
    -->
    <!-- Submit -->
    <button onclick={createCrapReport} type="submit">Submit</button>
</form>
{:else}
    <h1>Log in to create a crap report</h1>
{/if}