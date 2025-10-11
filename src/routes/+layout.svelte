<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { session } from "$lib/stores/session";
  import { onMount } from "svelte";
  import { allowedRoutes } from "$lib/routesByRole";
  import { publicRoutes } from "$lib/routesPublic";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  

  let currentRole: number | null = null;
  let token: string | null = null;
  let currentPath: string;

  onMount(() => {
    session.init();

    session.subscribe(($session) => {
      token = $session.token;
      currentRole = $session.payload?.rol ?? null;
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