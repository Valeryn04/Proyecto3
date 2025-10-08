<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";

  export let visible: boolean;
  export let perfil: any = {}; // Objeto con la info del perfil que se va a editar
  export let onClose: () => void;
  export let onSave: (data: any) => void;

  const dispatch = createEventDispatcher();

  // Estado interno del formulario
  let form = {
    id: "",
    perfil: "",
    estado: "",
    modulos: [] as string[],
    permisos: [] as string[],
  };

  // Lista de módulos con permisos
  let modulos = [
    {
      nombre: "Usuarios",
      seleccionado: false,
      permisos: [
        { id: 1, nombre: "Crear Usuario", seleccionado: false },
        { id: 2, nombre: "Editar Usuario", seleccionado: false },
        { id: 3, nombre: "Activar/Inactivar Usuario", seleccionado: false },
        { id: 4, nombre: "Ver Usuarios", seleccionado: false },
      ],
    },
    {
      nombre: "Perfiles",
      seleccionado: false,
      permisos: [
        { id: 5, nombre: "Crear Perfil", seleccionado: false },
        { id: 6, nombre: "Editar Perfil", seleccionado: false },
        { id: 7, nombre: "Ver Perfiles", seleccionado: false },
      ],
    },
    {
      nombre: "Sedes",
      seleccionado: false,
      permisos: [
        { id: 8, nombre: "Crear Sede", seleccionado: false },
        { id: 9, nombre: "Editar Sede", seleccionado: false },
        { id: 10, nombre: "Ver Sedes", seleccionado: false },
      ],
    },
  ];

  // 🔹 Cargar datos del perfil cuando el modal se abre
  $: if (visible && perfil && Object.keys(perfil).length > 0) {
    form = {
      id: perfil.id || "",
      perfil: perfil.nombre || "",
      estado: perfil.estado || "",
      modulos: perfil.modulos ? [...perfil.modulos] : [],
      permisos: perfil.permisos ? [...perfil.permisos] : [],
    };

    // Marcar módulos y permisos existentes
    modulos.forEach((m) => {
      m.seleccionado = form.modulos.includes(m.nombre);
      m.permisos.forEach(
        (p) => (p.seleccionado = form.permisos.includes(p.nombre))
      );
    });
  }

  function cerrarModal() {
    onClose();
  }

  // Marcar/desmarcar un permiso individual
  function togglePermiso(moduloIndex: number, permisoIndex: number) {
    const permiso = modulos[moduloIndex].permisos[permisoIndex];
    permiso.seleccionado = !permiso.seleccionado;

    modulos[moduloIndex].seleccionado = modulos[moduloIndex].permisos.every(
      (p) => p.seleccionado
    );
  }

  // Marcar/desmarcar un módulo completo
  function toggleModulo(index: number) {
    const modulo = modulos[index];
    modulo.seleccionado = !modulo.seleccionado;
    modulo.permisos.forEach(
      (permiso) => (permiso.seleccionado = modulo.seleccionado)
    );
  }

  // Guardar cambios
  function guardarCambios() {
    const modulosSeleccionados = modulos
      .filter((m) => m.seleccionado)
      .map((m) => m.nombre);

    const permisosSeleccionados = modulos
      .flatMap((m) => m.permisos)
      .filter((p) => p.seleccionado)
      .map((p) => p.nombre);

    const perfilActualizado = {
      ...form,
      modulos: modulosSeleccionados,
      permisos: permisosSeleccionados,
    };

    onSave(perfilActualizado);
    cerrarModal();
  }
</script>

{#if visible}
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    on:click={cerrarModal}
  >
    <div
      class="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]"
      on:click|stopPropagation
    >
      <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <i class="bi bi-pencil-square text-blue-600"></i>
        Editar Perfil
      </h2>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Perfil -->
        <div>
          <Label>Perfil</Label>
          <input
            type="text"
            bind:value={form.perfil}
            placeholder="Nombre del perfil"
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Estado -->
        <div>
          <Label>Estado</Label>
          <select
            bind:value={form.estado}
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione...</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <!-- Módulos y permisos -->
        <div class="md:col-span-2 mt-4 space-y-5">
          {#each modulos as modulo, i}
            <div class="border rounded-lg overflow-hidden shadow-sm">
              <div class="bg-[#2e4750] text-white px-4 py-2 font-semibold text-sm uppercase flex justify-between items-center">
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    bind:checked={modulo.seleccionado}
                    on:change={() => toggleModulo(i)}
                    class="h-4 w-4 text-[#da8780] border-gray-300 rounded focus:ring-[#da8780]"
                  />
                  <span>{modulo.nombre}</span>
                </label>
              </div>
              <div class="p-4 bg-gray-50">
                {#each modulo.permisos as permiso, j}
                  <label class="flex items-center space-x-3 py-1">
                    <input
                      type="checkbox"
                      bind:checked={permiso.seleccionado}
                      on:change={() => togglePermiso(i, j)}
                      class="h-4 w-4 text-[#da8780] border-gray-300 rounded focus:ring-[#da8780]"
                    />
                    <span class="text-gray-800 text-sm">{permiso.nombre}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <!-- Botones -->
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
          >
            Guardar cambios
          </button>
        </div>
      </form>
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
