<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { locationState } from '$lib/shared.svelte';

  //locationState.location = { latitude: parseFloat(page.params.latitude), longitude: parseFloat(page.params.longitude), view: locationState.location.view };

	async function onclick() {
		console.log('Button clicked!');

		/*
		let response = await pb.send('api/myapp/settings', {
			method: 'POST',
			body: JSON.stringify({
				title: 'bar'
			})
		});*/
		await crapReport();
	}

	let imageFile: File | null = null;

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target && target.files) {
			const file = target.files[0];
			if (file) {
				imageFile = file;

				const reader = new FileReader();
				reader.onloadend = () => {
					const img = new Image();
					img.onload = () => {
						const canvas = document.createElement('canvas');
						const ctx = canvas.getContext('2d');
						canvas.width = 256;
						canvas.height = 256;
						ctx?.drawImage(img, 0, 0, 256, 256);
						const base64String = canvas.toDataURL('image/jpeg').replace(/^data:.+;base64,/, '');
						initCrapReport.image = base64String;
						console.log('base64String', base64String);
					};
					img.src = reader.result as string;
				};
				reader.readAsDataURL(file);
			} else {
				imageFile = null;
				initCrapReport.image = "";
			}
		}
	}


	const initCrapReport = $state({
		description: 'test',
		latitude: locationState.location.latitude,
		longitude: locationState.location.longitude,
		tags: [] as string[],
		image: "" as string,
	});

	async function crapReport() {
		try {
			initCrapReport.latitude = locationState.location.latitude;
			initCrapReport.longitude = locationState.location.longitude;
			console.log('crapReport', initCrapReport);
			let response = await pb.send('/api/myapp/initcrap', {
				method: 'POST',
				body: JSON.stringify(initCrapReport)
			});
			console.log('crapReport response', response);
		} catch (error) {
			console.error('Error submitting report:', error);
			if (error instanceof Error) {
				alert('Error submitting report: ' + error.message);
			} else {
				alert('Error submitting report');
			}
		}
	}


</script>

<!-- This is the main home page content -->
<div class="mx-auto p-4 border border-gray-300 rounded-lg bg-gray-50">
  <div class="mb-4">
    <label for="latitude" class="block text-sm font-bold mb-2">Latitude</label>
    <input type="text" id="latitude" value={locationState.location.latitude} readonly class="w-full p-2 border border-gray-300 rounded" />
  </div>
  <div class="mb-4">
    <label for="longitude" class="block text-sm font-bold mb-2">Longitude</label>
    <input type="text" id="longitude" value={locationState.location.longitude} readonly class="w-full p-2 border border-gray-300 rounded" />
  </div>
  <div class="mb-4">
    <label for="description" class="block text-sm font-bold mb-2">Description</label>
    <textarea id="description" bind:value={initCrapReport.description} class="w-full p-2 border border-gray-300 rounded"></textarea>
  </div>
  <div class="mb-4">
    <label for="image" class="block text-sm font-bold mb-2">Image</label>
    <input type="file" id="image" accept="image/*" onchange={handleFileChange} class="w-full p-2 border border-gray-300 rounded" />
    {#if initCrapReport.image}
      <img src={`data:image/jpeg;base64,${initCrapReport.image}`} alt="Uploaded Image" class="mt-2 rounded" />
	{:else}
	  <p class="mt-2 text-sm text-gray-500">Can't proceed without an image!</p>
    {/if}
  </div>
  <div class="flex justify-center">
    <button {onclick} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-slate-600" disabled={!initCrapReport.image || !initCrapReport.description}>Submit Report</button>
  </div>
</div>
