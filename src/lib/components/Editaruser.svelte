<script lang="ts">
  export let visible: boolean;
  export let usuario: any = {};
  export let onClose: () => void;
  export let onSave: (data: any) => void;

  let form = {
    nombre: "",
    apellido: "",
    correo: "",
    tipoDocumento: "",
    documento: "",
    fechaNacimiento: "",
    sexo: "",
    telefono: "",
    direccion: "",
    perfil: "",
    estado: "",
  };

  let errors: Record<string, string> = {};

  // Cargar usuario al abrir
  $: if (visible && usuario) {
    form = { ...usuario };
    errors = {};
  }

  function cerrarModal() {
    onClose();
  }

  function validarFormulario() {
    errors = {};

    if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      errors.correo = "Formato de correo inválido.";
    }

    if (form.documento && !/^\d+$/.test(form.documento)) {
      errors.documento = "El documento debe contener solo números.";
    }

    if (form.telefono && !/^\d{7,10}$/.test(form.telefono)) {
      errors.telefono = "El teléfono debe tener entre 7 y 10 dígitos.";
    }

    if (
      form.fechaNacimiento &&
      !/^\d{4}-\d{2}-\d{2}$/.test(form.fechaNacimiento)
    ) {
      errors.fechaNacimiento = "Formato de fecha inválido (AAAA-MM-DD).";
    }

    return Object.keys(errors).length === 0;
  }

  function guardarCambios() {
    if (!validarFormulario()) return;
    console.log("Usuario actualizado:", form);
    onSave(form);
    cerrarModal();
  }
</script>

{#if visible}
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    on:click={cerrarModal}
  >
    <div
      class="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative animate-fadeIn"
      on:click|stopPropagation
    >
      <h2
        class="text-xl font-semibold mb-5 text-black-800 flex items-center gap-2"
      >
        <i class="bi bi-pencil-square text-blue-600"></i> Editar Usuario
      </h2>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-black-700">Nombre</label>
          <input
            bind:value={form.nombre}
            type="text"
            class="w-full border rounded-md p-2 mt-1 {errors.nombre ? 'error-border' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Apellido -->
        <div>
          <label class="block text-sm font-medium text-black-700">Apellido</label>
          <input
            bind:value={form.apellido}
            type="text"
            class="w-full border rounded-md p-2 mt-1 {errors.apellido ? 'error-border' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Correo -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-black-700">Correo</label>
          <input
            bind:value={form.correo}
            type="email"
            class="w-full border rounded-md p-2 mt-1 {errors.correo ? 'error-border' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500"
          />
          {#if errors.correo}<p class="error-text">{errors.correo}</p>{/if}
        </div>

        <!-- Tipo Documento -->
        <div>
          <label class="block text-sm font-medium text-black-700">Tipo Documento</label>
          <select
            bind:value={form.tipoDocumento}
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="CE">Cédula de Extranjería</option>
          </select>
        </div>

        <!-- Documento -->
        <div>
          <label class="block text-sm font-medium text-black-700">Número Documento</label>
          <input
            bind:value={form.documento}
            type="text"
            class="w-full border rounded-md p-2 mt-1 {errors.documento ? 'error-border' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500"
          />
          {#if errors.documento}<p class="error-text">{errors.documento}</p>{/if}
        </div>

        <!-- Fecha Nacimiento -->
        <div>
          <label class="block text-sm font-medium text-black-700">Fecha Nacimiento</label>
          <input
            bind:value={form.fechaNacimiento}
            type="date"
            class="w-full border rounded-md p-2 mt-1 {errors.fechaNacimiento ? 'error-border' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500"
          />
          {#if errors.fechaNacimiento}<p class="error-text">{errors.fechaNacimiento}</p>{/if}
        </div>

        <!-- Sexo -->
        <div>
          <label class="block text-sm font-medium text-black-700">Sexo</label>
          <select
            bind:value={form.sexo}
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-black-700">Teléfono</label>
          <input
            bind:value={form.telefono}
            type="text"
            maxlength="10"
            class="w-full border rounded-md p-2 mt-1 {errors.telefono ? 'error-border' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500"
          />
          {#if errors.telefono}<p class="error-text">{errors.telefono}</p>{/if}
        </div>

        <!-- Dirección -->
        <div>
          <label class="block text-sm font-medium text-black-700">Dirección</label>
          <input
            bind:value={form.direccion}
            type="text"
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Perfil -->
        <div>
          <label class="block text-sm font-medium text-black-700">Perfil</label>
          <select
            bind:value={form.perfil}
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Administrador">Administrador</option>
            <option value="Cliente">Cliente</option>
            <option value="Empleado">Empleado</option>
          </select>
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm font-medium text-black-700">Estado</label>
          <select
            bind:value={form.estado}
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <!-- Botones -->
        <div class="md:col-span-2 flex justify-end mt-4 space-x-3">
          <button
            type="button"
            class="px-4 py-2 rounded-md border border-gray-300 text-black-700 hover:bg-gray-100"
            on:click={cerrarModal}
          >
            Cancelar
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            on:click={guardarCambios}
          >
            Guardar Cambios
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

  .error-border {
    border-color: #ef4444 !important;
  }

  .error-text {
    font-size: 0.8rem;
    color: #ef4444;
    margin-top: 0.25rem;
  }

  @media (max-width: 640px) {
    form {
      display: flex;
      flex-direction: column;
    }
  }
</style>
