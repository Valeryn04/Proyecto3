<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import {
    obtenerModulosYPermisos,
    crearRolConModulosPermisos,
    type Modulo as ServicioModulo,
    type Permiso as ServicioPermiso,
    type Modulo,
  } from "$lib/services/rol";

  export let visible: boolean;
  export let onClose: () => void;
  const dispatch = createEventDispatcher();

  let perfilNuevo = {
    nombre_rol: "",
    descripcion: "",
  };

  interface PermisoLocal extends ServicioPermiso {
    seleccionado: boolean;
    nombre_funcionalidad: string;
    id_permiso: number;
  }

  interface ModuloLocal extends ServicioModulo {
    seleccionado: boolean;
    permisos: PermisoLocal[];
  }

  let modulos: ModuloLocal[] = [];
  let cargando = false;
  let errorMensaje = "";

  onMount(async () => {
    await cargarModulos();
  });

  async function cargarModulos() {
    try {
      cargando = true;
      errorMensaje = "";
      const respuesta = await obtenerModulosYPermisos();

      const lista = Array.isArray(respuesta) ? respuesta : (respuesta.resultado ?? []);
      
      const agrupado: Record<string, ModuloLocal> = {};

      lista.forEach((item: any) => {
        const nombreModulo = item.nombre_modulo;
        
        if (!agrupado[nombreModulo]) {
          agrupado[nombreModulo] = {
            id_modulo: item.id_modulo,
            nombre_modulo: nombreModulo,
            seleccionado: false,
            permisos: [],
          };
        }
        
        agrupado[nombreModulo].permisos.push({
          id_permiso: item.id,
          nombre_permiso: item.nombre_permiso,
          nombre_funcionalidad: item.nombre_funcionalidad,
          seleccionado: false,
        });
      });

      modulos = Object.values(agrupado);

      console.log("✅ Módulos agrupados correctamente:", modulos);
    } catch (error) {
      console.error("❌ Error al cargar módulos:", error);
      errorMensaje = "Error al cargar módulos y permisos.";
    } finally {
      cargando = false;
    }
  }

  // ✅ Alternar selección de un permiso individual
  function togglePermiso(moduloIndex: number, permisoIndex: number) {
    const modulo = modulos[moduloIndex];
    const permiso = modulo?.permisos?.[permisoIndex];
    if (!permiso) return;

    // Cambiar estado del permiso
    permiso.seleccionado = !permiso.seleccionado;

    // IMPORTANTE: Si se selecciona al menos un permiso, el módulo DEBE estar marcado
    const hayPermisoSeleccionado = modulo.permisos.some((p) => p.seleccionado);
    modulo.seleccionado = hayPermisoSeleccionado;
    
    // Forzar reactividad
    modulos = [...modulos];
  }

  // ✅ Alternar selección de todo el módulo
  function toggleModulo(index: number) {
    const modulo = modulos[index];
    
    // Cambiar estado del módulo
    modulo.seleccionado = !modulo.seleccionado;
    
    // Si se desmarca el módulo, desactivar TODOS los permisos
    if (!modulo.seleccionado) {
      modulo.permisos.forEach((permiso) => {
        permiso.seleccionado = false;
      });
    }
    // Si se marca el módulo, activar TODOS los permisos
    else {
      modulo.permisos.forEach((permiso) => {
        permiso.seleccionado = true;
      });
    }
    
    // Forzar reactividad
    modulos = [...modulos];
  }

  // ✅ Guardar rol con permisos
  async function guardar() {
    try {
      cargando = true;
      errorMensaje = "";

      // Solo incluir módulos que estén marcados y tengan permisos seleccionados
      const modulos_permisos = modulos
        .filter((m) => m.seleccionado && m.permisos.some((p) => p.seleccionado))
        .map((m) => ({
          id_modulo: m.id_modulo,
          permisos: m.permisos
            .filter((p) => p.seleccionado)
            .map((p) => p.id_permiso),
        }));

      if (modulos_permisos.length === 0) {
        errorMensaje = "Debes seleccionar al menos un módulo con sus permisos";
        cargando = false;
        return;
      }

      const dataEnviar = {
        nombre_rol: perfilNuevo.nombre_rol.trim(),
        descripcion: perfilNuevo.descripcion.trim(),
        modulos_permisos,
      };

      console.log("📤 Enviando al backend:", dataEnviar);

      const resultado = await crearRolConModulosPermisos(dataEnviar);
      dispatch("crear", resultado);
      cerrarModal();
    } catch (err: any) {
      console.error("❌ Error al guardar rol:", err);
      errorMensaje = err?.message || "Error al guardar el rol.";
    } finally {
      cargando = false;
    }
  }

  function cerrarModal() {
    onClose();
  }
</script>

{#if visible}
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    on:click={cerrarModal}
  >
    <div
      class="bg-white rounded-xl shadow-lg w-[95%] max-w-5xl p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]"
      on:click|stopPropagation
    >
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        Crear nuevo perfil
      </h2>

      {#if cargando}
        <p class="text-center text-gray-600">Cargando módulos...</p>
      {:else if errorMensaje}
        <p class="text-center text-red-600">{errorMensaje}</p>
      {:else}
        <!-- Campos básicos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre del perfil
            </label>
            <input
              type="text"
              bind:value={perfilNuevo.nombre_rol}
              placeholder="Ej: Gerente, Administrador..."
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#da8780] outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              bind:value={perfilNuevo.descripcion}
              placeholder="Ej: Acceso total al sistema"
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#da8780] outline-none"
            />
          </div>
        </div>

        <!-- Lista de módulos -->
        <div class="space-y-6 mt-4">
          {#each modulos as modulo, i}
            <div
              class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div
                class="bg-[#2e4750] text-white px-4 py-2 font-semibold text-sm uppercase flex items-center justify-between"
              >
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modulo.seleccionado}
                    on:change={() => toggleModulo(i)}
                    class="h-4 w-4 accent-[#da8780]"
                  />
                  <span>{modulo.nombre_modulo}</span>
                </label>
              </div>

              <div
                class="bg-gray-50 px-6 py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2"
              >
                {#each modulo.permisos as permiso, j}
                  <label
                    class="flex items-center space-x-3 text-gray-800 text-sm cursor-pointer hover:text-[#da8780] transition"
                  >
                    <input
                      type="checkbox"
                      checked={permiso.seleccionado}
                      on:change={() => togglePermiso(i, j)}
                      class="h-4 w-4 accent-[#da8780]"
                    />
                    <span>{permiso.nombre_permiso}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <!-- Botones -->
        <div class="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            on:click={cerrarModal}
          >
            Cancelar
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-md bg-[#da8780] text-white hover:bg-[#c86c66]"
            on:click={guardar}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Guardar perfil"}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
</style>