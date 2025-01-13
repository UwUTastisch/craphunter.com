<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/nav-bar.svelte';
	import ShellLayout from '$lib/components/shell-layout.svelte';
  import { restoreAuthFromCookie, currentUser, pb} from '$lib/pocketbase';
  import { onMount } from 'svelte';

  import { user } from "$lib/shared.svelte.js";

  onMount(() => {
        restoreAuthFromCookie();
  });


  currentUser.subscribe
  (value => {
    user.user = !value ? null : { userID: value.id, user: value.name, nickname: null };
    console.log("user",user?.user);

    // after the above you can also access the auth data from the authStore
    console.log("is valid" ,pb.authStore.isValid);
    console.log("token",pb.authStore.token);
    if (pb.authStore.record) {
      console.log("record", pb.authStore.record.id);
    } else {
      console.log("no record");
    }
  });

  </script>
  
  <!-- Global Nav -->
  <NavBar user={user.user}/>
  
  <!--
	Our shell layout wraps the page content but includes a side/bottom panel for login or info.
	We pass the page <slot /> into the shell layout so the page content isn't overwritten.
  -->
  <ShellLayout user={user.user}>
	<slot />
  </ShellLayout>
  