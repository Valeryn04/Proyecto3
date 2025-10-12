<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "$lib/components/ui/sidebar";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { fetchModulosPorRol, getRolFromToken } from "$lib/services/userService"; 

  let items: { icon: string; title: string; url: string }[] = [];
  const user = { name: "Valeryn Admin", email: "admin@valeryn.com" };

  onMount(async () => {
    try {
      const rol = getRolFromToken();
      if (rol) {
        const modulos = await fetchModulosPorRol(rol);
        // 🔧 Ajusta según tu backend
        items = modulos.map((m: any) => ({
          icon: m.icono || "bi bi-circle",
          title: m.nombre_modulo,
          url: m.url || "#",
        }));
      }
    } catch (error) {
      console.error("Error al cargar menú:", error);
    }
  });

  function handleLogout() {
    goto("/");
    console.log("Cerrar sesión");
  }
</script>


<!-- Sidebar -->
<Sidebar class="border-r border-[#cac4a4] h-full flex flex-col justify-between">
  <SidebarContent class="flex-1 overflow-y-auto">
    <SidebarGroup>

     <SidebarGroupContent class="mt-8">
    <SidebarMenu class="flex flex-col gap-8 px-2">
        {#each items as item (item.title)}
            <SidebarMenuItem>
                
                <a 
                    href={item.url} 
                    class="w-full color-black hover:text-white hover:bg-[#da8780] 
                           transition-colors text-lg py-5 px-4 rounded-md font-medium 
                           flex items-center gap-3 text-bold">
                    
                    <i class="{item.icon} text-xl" aria-hidden="true"></i>
                    
                    <span>{item.title}</span>
                </a>
            </SidebarMenuItem>
        {/each}
    </SidebarMenu>
</SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>
