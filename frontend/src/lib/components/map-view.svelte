<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import type { Marker, Map as LeafletMap } from 'leaflet';
	import { pb, storeLocationToCookie } from '$lib/pocketbase';
	import { locationState } from '$lib/shared.svelte';


	let map: LeafletMap;
	const dispatch = createEventDispatcher();
	const map_id = `map-${Date.now()}`;

	let map_height = 0;
	let map_width = 0;
	let crapItems: any[] = [];
	let markers: Marker[] = [];


	onMount(async () => {
		map_height = window.innerHeight - 150;
		// Example offset if you have a nav bar. Adjust as needed.
		map_width = window.innerWidth;

		const L = await import('leaflet');

		console.log('locationState', locationState.location);
		map = L.map(map_id).setView([locationState.location.latitude, locationState.location.longitude], locationState.location.view);

		map.on('moveend', () => {
			const center = map.getCenter();
			locationState.location = {
				latitude: center.lat,
				longitude: center.lng,
				view: map.getZoom()
			};
			//$inspect(locationState.location);
			fetchCrap();
			storeLocationToCookie();
		});
			
		
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
		//console.log('fetching crap');
		await fetchCrap();

		//console.log(crapItems);
		setInterval(fetchCrap, 5000);
	});

	async function fetchCrap() {
		crapItems = await pb.collection('crap').getFullList({
			//filter: 'latitude >= "0" && longitude >= "0"',
			filter: `latitude>=${map.getBounds().getSouth()} && latitude<=${map.getBounds().getNorth()} && longitude>=${map.getBounds().getWest()} && longitude<=${map.getBounds().getEast()}`,
			expand: 'crap_report'
		});

		renderMarkers();
	}

	async function renderMarkers() {
		markers.forEach((m) => m.remove());
		markers = [];

		const L = await import('leaflet');
		crapItems.forEach((c) => {
			let imageURL = pb.files.getURL(c.expand.crap_report[0], c.expand.crap_report[0].image, {
				thumb: '30x30'
			});
			if (!imageURL) {
				//imageURL = 'https://picsum.photos/200';
				imageURL = 'https://via.placeholder.com/30';
			}
			const icon = new L.Icon({
				//iconUrl: 'http://127.0.0.1:8090/api/files/COLLECTION_ID_OR_NAME/RECORD_ID/FILENAME',
				iconUrl: imageURL,
				iconSize: [40, 40]
			});

			const marker = L.marker([c.latitude, c.longitude], { icon })
				.bindPopup(`<b>Crap #${c.id}</b><br>${c.description}`)
				.on('click', () => {
					console.log('crap', c);
					dispatch('openCrap', c);
				})
				.addTo(map);
			markers.push(marker);
		});
	}
</script>

<div id={map_id} style="height: 100%; width: auto"></div>

<style>
	:global(.leaflet-marker-icon) {
		border-radius: 50px !important;
		border: 2px solid white !important;
		background-color: white !important;
	}
</style>
