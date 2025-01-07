<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/nav-bar.svelte';
	import ShellLayout from '$lib/components/shell-layout.svelte';
  import { restoreAuthFromCookie, currentUser} from '$lib/pocketbase';
  import { onMount } from 'svelte';

  let user: { user: string, nickname: string | null } | null = null; // e.g., { user: { userID, nickname } } or null
  

  onMount(() => {
        restoreAuthFromCookie();
  });

  currentUser.subscribe
  (value => {
    user = !value ? null : { user: value.name, nickname: null };
    console.log(user);
  });

  </script>
  
  <!-- Global Nav -->
  <NavBar user={user}/>
  
  <!--
	Our shell layout wraps the page content but includes a side/bottom panel for login or info.
	We pass the page <slot /> into the shell layout so the page content isn't overwritten.
  -->
  <ShellLayout user={user}>
	<slot />
  </ShellLayout>
  