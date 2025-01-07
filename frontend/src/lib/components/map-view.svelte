<script lang="ts">
    import { onMount } from 'svelte';
    import 'leaflet/dist/leaflet.css';
    import type { Marker, Map as LeafletMap } from 'leaflet';
  
    let map: LeafletMap;
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
      map = L.map(map_id).setView([50.8464487, 8.0954997], 5.5);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
      await fetchCrap();
      setInterval(fetchCrap, 5000);
    });
  
    async function fetchCrap() {
      
    }
  
    async function renderMarkers() {
      markers.forEach((m) => m.remove());
      markers = [];
  
      const L = await import('leaflet');
      crapItems.forEach((c) => {
        const icon = new L.Icon({
          iconUrl: '/icons/default-crap.png',
          iconSize: [40, 40]
        });
        const marker = L.marker([c.latitude, c.longitude], { icon }).addTo(map);
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
  