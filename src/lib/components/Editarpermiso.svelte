<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Label } from "$lib/components/ui/label";
  import {
    obtenerModulosPorRol,
    obtenerModulosYPermisos,
    actualizarRol,
    type Modulo,
    type RolEditar,
    type Permiso
  } from "$lib/services/rol";

  export let visible: boolean;
  export let perfil: any = {};
  export let onClose: () => void;
  export let onSave: (data: any) => void;

  const dispatch = createEventDispatcher();

  let form = { id: "", perfil: "", estado: "" };
  let modulos: (Modulo & { permisos: (Permiso & { asignada: boolean })[]; seleccionado?: boolean })[] = [];
  let mensaje = "";
  let cargando = false;

  // 🟢 Cargar datos al abrir el modal
  $: if (visible && (perfil?.id_rol || perfil?.id)) {
    cargarDatos(perfil.id_rol || perfil.id);
  }

  // 🔹 Cargar módulos y permisos
  async function cargarDatos(idRol: number) {
    try {
      cargando = true;

      const todosLosModulos = await obtenerModulosYPermisos();
      const modulosAsignados = await obtenerModulosPorRol(idRol);

     // 🔹 Mezcla ambos arrays
    modulos = todosLosModulos.map((mod) => {
      const asignado = modulosAsignados.find((m) => m.id_modulo === mod.id_modulo);

      // 🔸 Marca los permisos asignados
      const permisos = mod.permisos?.map((p) => {
        const tiene = !!asignado?.funcionalidades?.some(
          (f) => f.permiso?.toLowerCase() === p.nombre_permiso?.toLowerCase()
        );
          return { ...p, asignada: tiene };
        }) || [];

        const seleccionado = permisos.some((p) => p.asignada);
        return { ...mod, permisos, seleccionado };
      });

      form = {
        id: perfil.id_rol || perfil.id,
        perfil: perfil.nombre_rol || perfil.nombre || "",
        estado: perfil.estado || "Activo",
      };
    } catch (error) {
      console.error("❌ Error al cargar datos del rol:", error);
      mensaje = "Error al cargar los módulos del perfil.";
    } finally {
      cargando = false;
    }
  }

  // 🔸 Alternar un permiso individual
  function togglePermiso(moduloId: number, permisoId: number) {
    const modulo = modulos.find((m) => m.id_modulo === moduloId);
    if (!modulo) return;

    const permiso = modulo.permisos.find((p) => p.id_permiso === permisoId);
    if (!permiso) return;

    permiso.asignada = !permiso.asignada;
    modulo.seleccionado = modulo.permisos.some((p) => p.asignada);
  }

  // 🔸 Activar/desactivar todos los permisos del módulo
  function toggleModulo(moduloId: number) {
    const modulo = modulos.find((m) => m.id_modulo === moduloId);
    if (!modulo) return;

    const activar = !modulo.seleccionado;
    modulo.permisos.forEach((p) => (p.asignada = activar));
    modulo.seleccionado = activar;
  }

  // 🔹 Guardar cambios
  async function guardarCambios() {
    cargando = true;
    try {
      const modulos_permisos = modulos
        .filter((m) => m.permisos.some((p) => p.asignada))
        .map((m) => ({
          id_modulo: m.id_modulo,
          permisos: m.permisos.filter((p) => p.asignada).map((p) => p.id_permiso),
        }));

      const data: RolEditar = {
        nombre_rol: form.perfil,
        descripcion: `Perfil ${form.perfil}`,
        modulos_permisos,
      };

      const res = await actualizarRol(Number(form.id), data);
      mensaje = res.message || "Perfil actualizado correctamente";

      setTimeout(() => {
        onSave(data);
        onClose();
      }, 1000);
    } catch (err: any) {
      mensaje = err.message || "Error al actualizar el perfil.";
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
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]"
    >
      <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <i class="bi bi-pencil-square text-blue-600"></i>
        Editar Perfil
      </h2>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Perfil</Label>
          <input
            type="text"
            bind:value={form.perfil}
            placeholder="Nombre del perfil"
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label>Estado</Label>
          <select
            bind:value={form.estado}
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div class="md:col-span-2 mt-4 space-y-5">
          {#if cargando}
            <p class="text-gray-600">Cargando módulos...</p>
          {:else if modulos.length === 0}
            <p class="text-gray-600">No se encontraron módulos asociados.</p>
          {:else}
            {#each modulos as modulo}
              <div class="border rounded-lg overflow-hidden shadow-sm">
                <div
                  class="bg-[#2e4750] text-white px-4 py-2 font-semibold text-sm uppercase flex justify-between items-center"
                >
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={modulo.seleccionado}
                      on:change={() => toggleModulo(modulo.id_modulo)}
                      class="h-4 w-4 text-[#da8780] border-gray-300 rounded focus:ring-[#da8780]"
                    />
                    <span>{modulo.nombre_modulo}</span>
                  </label>
                </div>

                <div class="p-4 bg-gray-50">
                  {#each modulo.permisos as p}
                    <label class="flex items-center space-x-3 py-1">
                      <input
                        type="checkbox"
                        checked={p.asignada}
                        on:change={() => togglePermiso(modulo.id_modulo, p.id_permiso)}
                        class="h-4 w-4 text-[#da8780] border-gray-300 rounded focus:ring-[#da8780]"
                      />
                      <span class="text-gray-800 text-sm">
                        {p.nombre_permiso}
                      </span>
                    </label>
                  {/each}
                </div>
              </div>
            {/each}
          {/if}
        </div>

        <div class="md:col-span-2 flex justify-end mt-6 space-x-3">
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
            on:click={guardarCambios}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>

      {#if mensaje}
        <p class="mt-4 text-green-700 font-semibold">{mensaje}</p>
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
    animation: fadeIn 0.25s ease-in-out;
  }
</style>
