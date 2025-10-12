<script lang="ts">
    import { SidebarProvider, SidebarTrigger } from "$lib/components/ui/sidebar";
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from "$lib/components/ui/dropdown-menu";
    import Adminbar from "$lib/components/Adminbar.svelte";
    import { goto } from "$app/navigation";
    import { session } from "$lib/stores/session";
    import { get } from "svelte/store";
    import { onMount } from "svelte";
    import { fetchUserById } from "$lib/services/userService";
    import * as Avatar from "$lib/components/ui/avatar";
    import { fetchMiPerfil } from "$lib/services/userService";
    import { Badge } from "lucide-svelte";

    let user: { nombre: string; apellido: string } | null = null;
    let ready = false;

    onMount(async () => {
        const currentSession = get(session);
        
        // 1. Extraer el payload para la verificación de TypeScript
        const payload = currentSession.payload;
        const userRole = payload?.rol; // Usa optional chaining para obtener el rol

        // Roles permitidos para acceder a este panel
        const allowedRoles = [1, 2]; 

        // 2. 🚨 VERIFICACIÓN DE ACCESO: Comprueba la sesión, el payload y el rol
        if (
            !currentSession.loggedIn ||
            !payload || // Verificamos que el payload exista (soluciona error TS)
            !allowedRoles.includes(userRole!) // Verificamos si el rol está permitido
        ) {
            goto("/unauthorized");
            return;
        }

        try {
            // 3. Cargar usuario usando el payload, que ahora sabemos que no es null
            user = await fetchUserById(payload.sub); 
            
            console.log("Usuario cargado en layout:", user);
            ready = true;
        } catch (error) {
            console.error("No se pudo cargar usuario:", error);
            goto("/unauthorized");
        }
    });

    function handleLogout() {
        session.logout();
        goto("/", { replaceState: true });
    }

    function getIniciales(
        nombre: string | null | undefined,
        apellido?: string | null
    ): string {
        const n = nombre?.charAt(0).toUpperCase() || "";
        const a = apellido?.charAt(0).toUpperCase() || "";
        return n + a || "?";
    }
</script>

{#if ready}
    <SidebarProvider class="min-h-screen w-full">
        <div class="flex min-h-screen w-full bg-white">
            <Adminbar />
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
                            {#if user}
                                <div
                                    class="w-13 h-13 rounded-full bg-[#716557] text-white flex items-center justify-center text-base font-semibold shadow-sm"
                                >
                                    {getIniciales(user.nombre, user.apellido)}
                                </div>
                            {:else}
                                <div
                                    class="w-13 h-13 rounded-full bg-gray-300 animate-pulse"
                                ></div>
                            {/if}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            class="w-50 mt-2 bg-white border border-[#e5e0d3] shadow-md rounded-md"
                            align="end"
                        >
                            <DropdownMenuItem>
                                <button
                                    on:click={() => goto("/admin/perfil")}
                                    class="w-full color-black-500 hover:text-white hover:bg-[#da8780]
                                             transition-colors text-16 py-5 px-4 rounded-md font-medium
                                             flex items-center gap-20 text-bold">Mi perfil</button
                                >
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <button
                                    on:click={handleLogout}
                                    class="w-full color-black-500 hover:text-white hover:bg-[#da8780]
                                             transition-colors text-16 py-5 px-4 rounded-md font-medium
                                             flex items-center gap-20 text-bold"
                                    >Cerrar sesión</button
                                >
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
    <div class="min-h-screen flex items-center justify-center bg-[#f0f0ee]">
        <svg class="animate-spin h-8 w-8 text-[#a9887f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
{/if}