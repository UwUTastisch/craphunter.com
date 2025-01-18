<script lang="ts">
  import { goto } from '$app/navigation';

  import { initPasswordAuth, initRegistrationAuth } from '$lib/pocketbase';

  let mode = $state('login');
  let isLoading = $state(false);
  let email = $state('');
  let plainPassword = $state('');
  let nickname = $state('');
  let registerToken = $state('');
  let errorAnimation = $state(0);
  type AuthErrorState = {
    password?: { message?: string };
    email?: { message?: string };
    name?: { message?: string };
    registerToken?: { message?: string };
  };

  let error = $state<AuthErrorState>({});


  async function handleSubmit() {
    error = {};
    if (mode === 'login') {
      console.log('login');
      isLoading = true;
      let success = false;
      console.log(({email, plainPassword, nickname}));
      await initPasswordAuth(email, plainPassword, ()=> {
        //console.log('login success');
        success = true;
      });
      isLoading = false;
      if (!success) {
        errorAnimation = 3;
      } else {
        console.log('login success');
        await goto('/');
      } 
    } else if (mode === 'signup') {
      console.log('signup');
      isLoading = true;
      let success = false;
      try {
        await initRegistrationAuth(email, plainPassword, nickname, registerToken, ()=> {
          //console.log('signup success');
          success = true;
        });
      } catch (e: any) {
        console.log('signup error', e.data.data);
        error = e.data.data;
      }

      isLoading = false;
      if (!success) {
        errorAnimation = 3;
      } else {
        console.log('signup success');
        await goto('/');
      }
    }

    
  }

  $effect(() => {
    const interval = setInterval(() => {
			if (errorAnimation > 0) {
        errorAnimation -= 1;
      }
		}, 1000);

		return () => {
			// if a callback is provided, it will run
			// a) immediately before the effect re-runs
			// b) when the component is destroyed
			clearInterval(interval);
		};
  });
</script>

<div class="p-4">
  <h3 class="font-bold mb-2">{mode === 'login' ? 'Login' : 'Sign Up'}</h3>

  <label class="block mb-2">
    <span>Email</span>
    <input bind:value={email} class="border px-2 py-1 w-full" />
    {#if error.email}
      <div class="text-red-600">{error.email.message}</div>
    {/if}
  </label>

  {#if mode === 'signup'}
    <label class="block mb-2">
      <span>Nickname</span>
      <input bind:value={nickname} class="border px-2 py-1 w-full" />
      {#if error.name}
        <div class="text-red-600">{error.name.message}</div>
      {/if}
    </label>
    <label class="block mb-2">
      <span>Register Token</span>
      <input bind:value={registerToken} class="border px-2 py-1 w-full" />
      {#if error.registerToken}
        <div class="text-red-600">{error.registerToken.message}</div>
      {/if}
    </label>
  {/if}

  <label class="block mb-2">
    <span>Password</span>
    <input type="password" bind:value={plainPassword} class="border px-2 py-1 w-full" />
    {#if error.password}
      <div class="text-red-600">{error.password.message}</div>
    {/if}
  </label>

  <div class="flex gap-2 mt-2">
    <button
      class="text-white px-3 py-1 {errorAnimation > 0 ? 'bg-red-600 horizontal-shaking' : 'bg-blue-600'}"
      onclick={handleSubmit}
    >
      {errorAnimation ? "Wrong" : (mode === 'login' ? 'Login' : 'Sign Up')}
    </button>

    {#if isLoading}
      <div class="text-blue-600">Loading...</div>
    {/if}
    <button
      class="text-blue-600 underline"
      onclick={() => (mode = mode === 'login' ? 'signup' : 'login')}
    >
      {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
    </button>
  </div>
</div>


<style>

.horizontal-shaking {
  animation: horizontal-shaking 0.5s infinite;
}

@keyframes horizontal-shaking {
  0% { transform: translateX(0) }
  25% { transform: translateX(5px) }
  50% { transform: translateX(-5px) }
  75% { transform: translateX(5px) }
  100% { transform: translateX(0) }
}
</style>