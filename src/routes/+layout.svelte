<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { session } from "$lib/stores/session";
  import { cargarPermisos, limpiarPermisos } from "$lib/stores/modulos";
  import { onMount } from "svelte";
  import { allowedRoutes } from "$lib/routesByRole";
  import { publicRoutes } from "$lib/routesPublic";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  
  let currentRole: number | null = null;
  let token: string | null = null;
  let currentPath: string;
  let permisosLoaded = false;

  onMount(() => {
    session.init();

    session.subscribe(async ($session) => {
      token = $session.token;
      currentRole = $session.payload?.rol ?? null;

      // ✅ Cargar permisos cuando haya sesión activa
      if (token && currentRole && !permisosLoaded) {
        try {
          console.log('🔐 Cargando permisos para rol:', currentRole);
          await cargarPermisos(currentRole);
          permisosLoaded = true;
          console.log('✅ Permisos cargados exitosamente');
        } catch (error) {
          console.error('❌ Error cargando permisos:', error);
        }
      }

      // ✅ Limpiar permisos cuando se cierre sesión
      if (!token) {
        limpiarPermisos();
        permisosLoaded = false;
        console.log('🧹 Permisos limpiados');
      }
    });
  });

  $effect(() => {
    currentPath = $page.url.pathname;

    // Si la ruta es pública, no bloquea el acceso
    if (publicRoutes.includes(currentPath)) {
      return;
    }

    // Para rutas privadas, verifica token y rol
    if (!token || !currentRole) {
      goto("/");
      return;
    }

    const rutasPermitidas = allowedRoutes[currentRole] || [];

    if (!rutasPermitidas.includes(currentPath)) {
      goto(rutasPermitidas[0] ?? "/dashboard");
    }
  });

  let { children } = $props();
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}