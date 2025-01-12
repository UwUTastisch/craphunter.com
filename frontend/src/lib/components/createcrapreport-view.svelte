<script lang="ts">


import { pb } from '$lib/pocketbase';

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
    user: 'RELATION_RECORD_ID', // not for user input
    status: 'FIRST_SEEN', // not for user input
    description: '', // user input
    tags: [], // user input if crapRecord is not null
});


const crap = $state({
    description: '',
    latitude: latitude, // not for user input
    longitude: longitude, // not for user input
    craprecords: [] // not for user input
});

async function createCrap() {
    crap.description = crapReport.description;
    crapRecord = await pb.collection('crap').create(crap);
    console.log('Creating crap');
}

async function createCrapReport() {
    console.log('Creating crap report');
    const crapReportRecord = await pb.collection('crap_report').create(crapReport);
    console.log('Creating crap report');
    
    if (!crapRecord) {
        crapRecord.crapreports = [crapReportRecord];
        console.log('crapRecord is null, creating crap');
        await createCrap();
    } else {
        crapRecord.crapreports.push(crapReportRecord);
        console.log('crapRecord is not null, updating crap');
        await pb.collection('crap').update(crapRecord);
    }
}
</script>

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