<script lang="ts">
  import { SidebarProvider, SidebarTrigger } from "$lib/components/ui/sidebar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from "$lib/components/ui/dropdown-menu";
  import Adminbar from "$lib/components/Adminbar.svelte";
  import { goto } from "$app/navigation";
  import { session } from "$lib/stores/session";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { fetchUserById } from "$lib/services/userService";

  let user: { name: string; email: string } | null = null;
  let ready = false;

  onMount(async () => {
    const currentSession = get(session);

    // Verifica que esté logueado y que tenga rol 1
    if (
      !currentSession.loggedIn ||
      !currentSession.payload ||
      currentSession.payload.rol !== 1
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
      <Adminbar />
      <div class="flex flex-col flex-1 min-h-screen bg-[#f0f0ee]">
        <header class="flex items-center justify-between px-5 py-3 border-b border-[#c2ab99] shadow-sm">
          <SidebarTrigger class="mr-3"></SidebarTrigger>
          <h1 class="text-xl font-bold text-black tracking-wide select-none flex-grow">
            Panel Administrador
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger class="focus:outline-none hover:opacity-90 transition">
              {#if user}
                <div class="w-13 h-13 rounded-full bg-[#716557] text-white flex items-center justify-center text-base font-semibold shadow-sm">
                  {user.name.charAt(0)}
                </div>
              {:else}
                <div class="w-13 h-13 rounded-full bg-gray-300 animate-pulse"></div>
              {/if}
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-50 mt-2 bg-white border border-[#e5e0d3] shadow-md rounded-md" align="end">
              <DropdownMenuItem>
                <button on:click={() => goto("/admin/perfil")} class="w-full color-black-500 hover:text-white hover:bg-[#da8780] 
                           transition-colors text-16 py-5 px-4 rounded-md font-medium 
                           flex items-center gap-20 text-bold">Mi perfil</button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button on:click={handleLogout} class="w-full color-black-500 hover:text-white hover:bg-[#da8780] 
                           transition-colors text-16 py-5 px-4 rounded-md font-medium 
                           flex items-center gap-20 text-bold">Cerrar sesión</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
