<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let visible: boolean;
  export let onClose: () => void;
  const dispatch = createEventDispatcher();

  // Datos del nuevo perfil
  let perfilNuevo = {
    nombre: "",
    estado: "Activo",
    permisosSeleccionados: [] as number[]
  };

  // Lista de módulos y permisos
  let modulos = [
    {
      nombre: "Usuarios",
      seleccionado: false,
      permisos: [
        { id: 1, nombre: "Crear Usuario", seleccionado: false },
        { id: 2, nombre: "Editar Usuario", seleccionado: false },
        { id: 3, nombre: "Activar/Inactivar Usuario", seleccionado: false },
        { id: 4, nombre: "Ver Usuarios", seleccionado: false }
      ]
    },
    {
      nombre: "Perfiles",
      seleccionado: false,
      permisos: [
        { id: 5, nombre: "Crear Perfil", seleccionado: false },
        { id: 6, nombre: "Editar Perfil", seleccionado: false },
        { id: 7, nombre: "Ver Perfiles", seleccionado: false }
      ]
    },
    {
      nombre: "Sedes",
      seleccionado: false,
      permisos: [
        { id: 8, nombre: "Crear Sede", seleccionado: false },
        { id: 9, nombre: "Editar Sede", seleccionado: false },
        { id: 10, nombre: "Ver Sedes", seleccionado: false }
      ]
    }
  ];

  // Marcar/desmarcar un permiso individual
  function togglePermiso(moduloIndex: number, permisoIndex: number) {
    const permiso = modulos[moduloIndex].permisos[permisoIndex];
    permiso.seleccionado = !permiso.seleccionado;

    // Si todos los permisos están seleccionados, marcar el módulo
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

  // Guardar perfil
  function guardar() {
    const permisosSeleccionados = modulos
      .flatMap((m) => m.permisos.filter((p) => p.seleccionado))
      .map((p) => p.id);

    const perfil = {
      ...perfilNuevo,
      permisosSeleccionados
    };

    dispatch("crear", perfil);
    cerrarModal();
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

      <!-- Campos básicos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del perfil</label>
          <input
            type="text"
            bind:value={perfilNuevo.nombre}
            placeholder="Ej: Administrador"
            class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#da8780] outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            bind:value={perfilNuevo.estado}
            class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#da8780] outline-none"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <!-- Lista de módulos -->
      <div class="space-y-5">
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
        >
          Guardar perfil
        </button>
      </div>
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
