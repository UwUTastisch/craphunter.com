<script>
	import MapView from '$lib/components/map-view.svelte';
	import { pb } from '$lib/pocketbase';
	import { user } from '$lib/shared.svelte';

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

	const initCrapReport = $state({
		description: 'test',
		latitude: 52,
		longitude: 12,
		tags: ['h0m9aw43tu2c18v']
	});

	async function crapReport() {
		console.log('crapReport', initCrapReport);
		let response = await pb.send('/api/myapp/initcrap', {
			method: 'POST',
			body: JSON.stringify(initCrapReport)
		});
		console.log('crapReport response', response);
	}
</script>

<!-- This is the main home page content -->
<div class="h-full w-full">
	<button {onclick}>Test Button</button>
</div>
