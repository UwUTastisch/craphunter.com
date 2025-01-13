<script lang="ts">
	export let user: { user: string, nickname: string | null } | null = null; // e.g., { user: { userID, nickname } } or null
  
	import { logout } from '$lib/pocketbase';

	async function logout_F() {
		// Clear the cookie
		await logout();


		location.reload();
	}
  
	function openLoginForm() {
	  // move to the login page
	  location.href = '/login';
	  
	}
  </script>
  
  <nav class="bg-gray-200 p-4 flex items-center justify-between">
	<div class="font-bold text-xl">Crap Hunter</div>
	<div>
	  {#if user}
		<span class="mr-4">Hello {user.nickname ?? user.user}!</span>
		<button on:click={logout_F} class="bg-red-600 text-white px-3 py-1 rounded">
		  Logout
		</button>
	  {:else}
		<!-- Show a "Login" button if not logged in -->
		<button
		  on:click={openLoginForm}
		  class="bg-blue-600 text-white px-3 py-1 rounded"
		>
		  Login
		</button>
	  {/if}
	</div>
  </nav>
  