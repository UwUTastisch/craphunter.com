<script>
	import { onMount } from 'svelte';
	import { userState } from '$lib/shared.svelte';
</script>

<section class="max-w-lg mx-auto mt-8 p-4 text-center">
	<h1 class="text-3xl font-bold mb-4">Welcome to Craphunter.com</h1>
	<p class="text-gray-700">
		Report any crap you find and help keep communities clean.
	</p>
	<a
		href={userState ? "/createcrapreport/location" : "/login"}
		class="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
	>
		{userState ? "Create Crap Report" : "Login"}
	</a>
</section>
