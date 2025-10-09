<script lang="ts">
   import { session } from "$lib/stores/session";
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
    import { fetchUserById } from "$lib/services/userService";
  import { SidebarProvider } from "$lib/components/ui/sidebar";


    let user: { name: string; email: string } | null = null;
    let ready = false;


 onMount(async () => {
    const currentSession = get(session);

    // Verifica que esté logueado y que tenga rol 1
    if (
      !currentSession.loggedIn ||
      !currentSession.payload ||
      currentSession.payload.rol !== 2
    ) {
      goto("/unauthorized");
      return;
    }

    try {
      user = await fetchUserById(currentSession.payload.sub);
      ready = true; // solo mostramos el contenido si se pasa todo
    } catch (error) {
      console.error("No se pudo cargar usuario:", error);
      goto("/unauthorized");
    }
  });

  function handleLogout() {
    session.logout();
    goto("/", { replaceState: true });
  }
</script>

{#if ready}
  <!-- Solo se muestra si la sesión está validada -->
  <SidebarProvider class="min-h-screen w-full">
    <div class="flex min-h-screen w-full bg-white">

      <div class="flex flex-col flex-1 min-h-screen bg-[#f0f0ee]">
        <header class="flex items-center justify-between px-5 py-3 border-b border-[#c2ab99] shadow-sm">
            <h1>Hola</h1>
        </header>

        <main class="flex-grow bg-[#f8f8f8] overflow-y-auto">
          <div class="px-10 py-8">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
{:else}
  <!-- Mientras se valida sesión, no mostrar nada (ni layout) -->
  <div class="min-h-screen bg-white"></div>
{/if}

