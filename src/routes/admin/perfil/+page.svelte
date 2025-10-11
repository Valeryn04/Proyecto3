<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { onMount } from "svelte";
  import { fetchMiPerfil } from "$lib/services/userService";
  import { Badge } from "lucide-svelte";

  // Estado de carga
  let loading = true;
  let error = "";

  // Datos del perfil
  let perfil: any = null;
  let usuario: any = null;
  let rol: any = null;
  let atributos: any[] = [];

  // Cargar perfil al montar el componente
  onMount(async () => {
    try {
      loading = true;
      error = "";

      console.log("🔍 Cargando perfil del usuario logueado...");

      perfil = await fetchMiPerfil();
      usuario = perfil.usuario;
      rol = perfil.rol;
      atributos = perfil.atributos || [];

      console.log("✅ Perfil cargado:", perfil);
    } catch (e: any) {
      console.error("❌ Error al cargar perfil:", e);
      error = e.message || "Error al cargar el perfil";
    } finally {
      loading = false;
    }
  });

  // Formatear fecha
  function formatearFecha(fecha: string | null): string {
    if (!fecha) return "N/A";
    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return fecha;
    }
  }
  function getIniciales(
    nombre: string | null | undefined,
    apellido?: string | null
  ): string {
    const n = nombre?.charAt(0).toUpperCase() || "";
    const a = apellido?.charAt(0).toUpperCase() || "";
    return n + a || "?";
  }

  function formatearNombreAtributo(nombre_atributo?: string): string {
    if (!nombre_atributo) return "Atributo sin nombre";
    return nombre_atributo
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
</script>

<div class="max-w-5xl mx-auto p-4">
  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#716557] border-t-transparent"
        ></div>
        <p class="mt-4 text-muted-foreground">Cargando perfil...</p>
      </div>
    </div>
  {:else if error}
    <Card.Root class="border-red-200 bg-red-50">
      <Card.Content class="pt-6">
        <div class="flex items-center gap-3 text-red-700">
          <i class="bi bi-exclamation-triangle-fill text-2xl"></i>
          <div>
            <h3 class="font-semibold">Error al cargar el perfil</h3>
            <p class="text-sm">{error}</p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  {:else if usuario}
    <div class="relative mb-8">
      <div
        class="h-25 bg-gradient-to-r from-[#716557] to-[#8a7a6a] rounded-t-2xl shadow-xl"
      ></div>

      <div
        class="relative px-8 pb-5 bg-white dark:bg-slate-900 rounded-b-2xl shadow-xl -mt-16"
      >
        <div
          class="flex flex-col md:flex-row items-center md:items-end gap-6 pt-20 md:pt-4"
        >
          <!-- Avatar -->
          <div class="relative -mt-24 md:-mt-16">
            <div class="p-1.5 bg-[#716557] rounded-full shadow-2xl">
              <Avatar.Root
                class="h-32 w-32 border-4 border-white dark:border-slate-900"
              >
                <Avatar.Image src="" alt={usuario.nombre} />
                <Avatar.Fallback
                  class="text-3xl font-bold bg-[#716557] text-white"
                >
                  {getIniciales(usuario.nombre, usuario.apellido)}
                </Avatar.Fallback>
              </Avatar.Root>
            </div>
          </div>

          <!-- Información principal -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {usuario.nombre || "Sin nombre"}
              {usuario.apellido || ""}
            </h1>
            <div
              class="flex flex-col md:flex-row items-center md:items-center gap-3 text-muted-foreground"
            >
              {#if usuario.email}
                <span class="flex items-center gap-2">
                  <i class="bi bi-envelope-at-fill"></i>
                  {usuario.email}
                </span>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs del perfil -->
    <Tabs.Root value="info" class="w-full">
      <Tabs.List
        class="grid w-full grid-cols-2 bg-white/50 h-13 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-slate-700"
      >
        <Tabs.Trigger
          value="info"
          class="data-[state=active]:bg-[#716557] data-[state=active]:text-white font-bold rounded-lg transition-all duration-300 py-3"
        >
          <span class="flex items-center justify-center gap-2">
            <i class="bi bi-person w-5 h-5"></i>
            Información Personal
          </span>
        </Tabs.Trigger>

        <Tabs.Trigger
          value="atributos"
          class="data-[state=active]:bg-[#716557] data-[state=active]:text-white font-bold rounded-lg transition-all duration-300 py-3"
        >
          <span class="flex items-center justify-center gap-2">
            <i class="bi bi-list-ul w-5 h-5"></i>
            Acerca de mi ({atributos.length})
          </span>
        </Tabs.Trigger>
      </Tabs.List>

      <!-- Tab: Información Personal -->
      <Tabs.Content value="info" class="mt-6">
        <Card.Root
          class="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        >
          <Card.Content class="pt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-person-fill text-blue-600"></i>
                  Nombre de Usuario
                </Label>
                <Input
                  value={usuario.usuario}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-person-fill text-blue-600"></i>
                  Nombre Completo
                </Label>
                <Input
                  value={`${usuario.nombre} ${usuario.apellido}`}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-card-text text-purple-600"></i>
                  Tipo de Documento
                </Label>
                <Input
                  value={usuario.tipo_documento}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-hash text-purple-600"></i>
                  Número de Documento
                </Label>
                <Input
                  value={usuario.numero_documento}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-calendar-event text-pink-600"></i>
                  Fecha de Nacimiento
                </Label>
                <Input
                  value={formatearFecha(usuario.fecha_nacimiento)}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-gender-ambiguous text-indigo-600"></i>
                  Sexo
                </Label>
                <Input
                  value={usuario.sexo === "M"
                    ? "Masculino"
                    : usuario.sexo === "F"
                      ? "Femenino"
                      : usuario.sexo}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-telephone-fill text-green-600"></i>
                  Teléfono
                </Label>
                <Input
                  value={usuario.telefono}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div class="space-y-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-envelope-at-fill text-orange-600"></i>
                  Email
                </Label>
                <Input
                  value={usuario.email}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <Label class="text-sm font-bold flex items-center gap-2">
                  <i class="bi bi-geo-alt-fill text-red-600"></i>
                  Dirección
                </Label>
                <Input
                  value={usuario.direccion || "No especificada"}
                  disabled
                  class="bg-gray-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>

      <!-- Tab: Atributos -->
      <Tabs.Content value="atributos" class="mt-6">
        <Card.Root
          class="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        >
          <Card.Content class="pt-2">
            {#if atributos.length === 0}
              <div class="text-center py-12">
                <i class="bi bi-inbox text-6xl text-muted-foreground mb-4"></i>
                <h3 class="text-xl font-semibold text-muted-foreground">
                  No hay atributos registrados
                </h3>
                <p class="text-sm text-muted-foreground mt-2">
                  Este usuario no tiene atributos adicionales configurados.
                </p>
              </div>
            {:else}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                {#each atributos as atributo}
                  <Card.Root
                    class="border-2 border-[#716557]/20 transition-all hover:shadow-lg"
                  >
                    <Card.Header>
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h3
                            class="text-lg font-bold text-[#716557] capitalize"
                          >
                            {formatearNombreAtributo(atributo.nombre_atributo)}
                          </h3>
                          {#if atributo.descripcion_atributo}
                            <p class="text-sm text-muted-foreground mt-1">
                              {atributo.descripcion_atributo}
                            </p>
                          {/if}
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Content>
                      <div class="space-y-2">
                          <p class="font-medium">{atributo.valor}</p>
                        </div>
                    </Card.Content>
                  </Card.Root>
                {/each}
              </div>
            {/if}
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  {/if}
</div>
