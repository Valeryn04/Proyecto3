<script lang="ts">
  import Adminbar from "$lib/components/Adminbar.svelte";;
  let sidebarOpen = false;
</script>

<div class="min-h-screen flex bg-[#f9f7f3]">
  <!-- Sidebar -->
  <Adminbar />

  <!-- Contenedor principal -->
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between p-4 border-b border-[#cac4a4] bg-white/80">
      <button class="md:hidden" on:click={() => sidebarOpen = !sidebarOpen}>
      </button>
      <h1 class="text-lg font-semibold text-[#1f1411]">Panel Administrador</h1>
      <span class="text-[#716557]">Valeryn</span>
    </header>

    <!-- Main (contenido del +page.svelte) -->
    <main class="p-6">
      <slot />
    </main>
  </div>
</div>
