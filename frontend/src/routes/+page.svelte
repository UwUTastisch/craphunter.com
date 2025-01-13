<script>
	import MapView from '$lib/components/map-view.svelte';
	import { pb } from '$lib/pocketbase';
	import { user } from '$lib/shared.svelte';

	async function onclick() {
		console.log('Button clicked!');

		let response = await pb.send('api/myapp/settings', {
			method: 'POST',
			body: JSON.stringify({
				title: 'bar'
			})
		});

	}
</script>

<!-- This is the main home page content -->
<div class="h-full w-full">
	<button {onclick}>Test Button</button>
</div>
