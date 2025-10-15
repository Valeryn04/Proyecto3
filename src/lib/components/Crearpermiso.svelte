<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import {
    obtenerModulosYPermisos,
    crearRolConModulosPermisos,
    type Modulo,
    type Permiso,
  } from "$lib/services/rol";

  export let visible: boolean;
  export let onClose: () => void;
  const dispatch = createEventDispatcher();

  let perfilNuevo = {
    nombre_rol: "",
    descripcion: "",
  };

  let modulos: Modulo[] = [];
  let cargando = false;
  let errorMensaje = "";

  onMount(() => {
    cargarModulos();
  });

  async function cargarModulos() {
    try {
      cargando = true;
      const respuesta = await obtenerModulosYPermisos();
      modulos = respuesta.map((mod: any) => ({
        ...mod,
        seleccionado: false,
        permisos: mod.permisos.map((p: any) => ({
          ...p,
          seleccionado: false,
        })),
      }));
      console.log("✅ Módulos y permisos agrupados:", modulos);
    } catch (error) {
      console.error("❌ Error al cargar módulos:", error);
      errorMensaje = "Error al cargar los módulos y permisos.";
    } finally {
      cargando = false;
    }
  }

  // 🔸 Alternar todo el módulo
  function toggleModulo(i: number) {
    const modulo = modulos[i];
    modulo.seleccionado = !modulo.seleccionado;
    modulo.permisos.forEach((p) => (p.seleccionado = modulo.seleccionado));
    modulos = [...modulos];
  }

  // 🔸 Alternar un permiso individual
  function togglePermiso(modIndex: number, permIndex: number) {
    const permiso = modulos[modIndex].permisos[permIndex];
    permiso.seleccionado = !permiso.seleccionado;
    modulos[modIndex].seleccionado = modulos[modIndex].permisos.some(
      (p) => p.seleccionado
    );
    modulos = [...modulos];
  }

  // 🔹 Guardar rol
  async function guardar() {
    try {
      cargando = true;
      const modulos_permisos = modulos
        .filter((m) => m.permisos.some((p) => p.seleccionado))
        .map((m) => ({
          id_modulo: m.id_modulo,
          permisos: m.permisos.filter((p) => p.seleccionado).map((p) => p.id_permiso),
        }));

      if (!perfilNuevo.nombre_rol.trim()) {
        errorMensaje = "El nombre del rol es obligatorio.";
        cargando = false;
        return;
      }

      if (modulos_permisos.length === 0) {
        errorMensaje = "Selecciona al menos un módulo con permisos.";
        cargando = false;
        return;
      }

      const payload = {
        nombre_rol: perfilNuevo.nombre_rol.trim(),
        descripcion: perfilNuevo.descripcion.trim(),
        modulos_permisos,
      };

      console.log("📤 Enviando:", payload);
      const res = await crearRolConModulosPermisos(payload);
      dispatch("crear", res);
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
        Crear nuevo rol
      </h2>

      {#if cargando}
        <p class="text-center text-gray-600">Cargando módulos...</p>
      {:else if errorMensaje}
        <p class="text-center text-red-600">{errorMensaje}</p>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre del rol
            </label>
            <input
              type="text"
              bind:value={perfilNuevo.nombre_rol}
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#da8780] outline-none"
              placeholder="Ej: Administrador"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              bind:value={perfilNuevo.descripcion}
              class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#da8780] outline-none"
              placeholder="Ej: Acceso total al sistema"
            />
          </div>
        </div>

        <!-- 🔸 Módulos y permisos -->
        <div class="space-y-6 mt-4">
          {#each modulos as modulo, i}
            <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div class="bg-[#2e4750] text-white px-4 py-2 font-semibold flex items-center justify-between">
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

              <div class="bg-gray-50 px-6 py-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-2">
                {#each modulo.permisos as permiso, j}
                  <label class="flex items-center space-x-3 text-gray-800 text-sm cursor-pointer hover:text-[#da8780] transition">
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
            {cargando ? "Guardando..." : "Guardar rol"}
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
