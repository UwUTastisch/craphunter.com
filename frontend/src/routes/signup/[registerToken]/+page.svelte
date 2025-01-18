<script>
	import AuthForm from "$lib/components/auth-form.svelte";
	
	import { page } from '$app/state';


    $: registerToken = page.params.registerToken;
</script>

<!-- This is the main home page content -->
<div class="h-full w-full">
	<!-- Render the map publicly -->
	<AuthForm mode='signup' registerToken={registerToken}/>
</div>
