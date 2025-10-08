<script lang="ts">
  import { SidebarProvider, SidebarTrigger } from "$lib/components/ui/sidebar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu";
  import Adminbar from "$lib/components/Adminbar.svelte";
  import { goto } from "$app/navigation";

  const user = {
    name: "Valeryn Admin",
    email: "admin@valeryn.com",
  };

  function handleLogout() {
    console.log("Cerrar sesión");

    // 🔹 Limpia toda la sesión del usuario
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.clear(); // por si guardas cosas ahí también

    // 🔹 Redirige al login
    goto("/", { replaceState: true });
  }
</script>

<SidebarProvider class="min-h-screen w-full">
  <div class="flex min-h-screen w-full bg-white">
    <!-- Sidebar -->
    <Adminbar />

    <!-- Contenedor principal -->
    <div class="flex flex-col flex-1 min-h-screen bg-[#f0f0ee]">
      <header
        class="flex items-center justify-between px-5 py-3 border-b border-[#c2ab99] shadow-sm"
      >
        <SidebarTrigger class="mr-3"></SidebarTrigger>

        <h1
          class="text-xl font-bold text-black tracking-wide select-none flex-grow"
        >
          Panel Administrador
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger
            class="focus:outline-none hover:opacity-90 transition"
          >
            <div
              class="w-13 h-13 rounded-full bg-[#716557] text-white flex items-center justify-center text-base font-semibold shadow-sm"
            >
              {user.name.charAt(0)}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            class="w-60 mt-2 bg-white border border-[#e5e0d3] shadow-md rounded-md"
            align="end"
            ><DropdownMenuItem>
              <button
                on:click={() => goto("/admin/perfil")}
                class="flex items-center w-full text-left text-black hover:text-white hover:bg-[#da8780] py-2 px-2 rounded-md transition-colors text-base"
              >
                Mi perfil
              </button>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <button
                on:click={handleLogout}
                class="flex items-center w-full text-left text-black hover:text-white hover:bg-[#da8780] py-2 px-2 rounded-md transition-colors text-base"
              >
                Cerrar sesión
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <!-- Main -->
      <main class="flex-grow bg-[#f8f8f8] overflow-y-auto">
        <div class="px-10 py-8">
          <slot />
        </div>
      </main>
    </div>
  </div></SidebarProvider
>
