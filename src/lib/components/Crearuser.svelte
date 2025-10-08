<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let visible: boolean;
  export let onClose: () => void;

  const dispatch = createEventDispatcher();

  // Datos del formulario
  let usuario = {
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
    estado: ""
  };

  // Errores de validación
  let errores: Record<string, string> = {};

  // Cerrar modal
  function cerrarModal() {
    onClose();
  }

  // Validar campos
  function validarFormulario() {
    errores = {};
    if (!usuario.nombre.trim()) errores.nombre = "El nombre es obligatorio.";
    if (!usuario.apellido.trim()) errores.apellido = "El apellido es obligatorio.";
    if (!usuario.correo.trim() || !usuario.correo.includes("@"))
      errores.correo = "Correo inválido.";
    if (!usuario.tipoDocumento) errores.tipoDocumento = "Seleccione un tipo de documento.";
    if (!usuario.documento.trim()) errores.documento = "Número de documento requerido.";
    if (!usuario.fechaNacimiento.trim()) errores.fechaNacimiento = "Seleccione una fecha.";
    if (!usuario.sexo) errores.sexo = "Seleccione el sexo.";
    if (!usuario.telefono.trim()) errores.telefono = "El teléfono es obligatorio.";
    if (!usuario.direccion.trim()) errores.direccion = "La dirección es obligatoria.";
    if (!usuario.perfil) errores.perfil = "Seleccione un perfil.";
    if (!usuario.estado) errores.estado = "Seleccione el estado.";

    return Object.keys(errores).length === 0;
  }

  // Guardar usuario
  function guardarUsuario() {
    if (!validarFormulario()) return;
    console.log("✅ Usuario creado:", usuario);
    dispatch("crear", usuario);
    cerrarModal();
  }
</script>

{#if visible}
  <!-- Fondo -->
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    on:click={cerrarModal}
  >
    <!-- Modal -->
    <div
      class="bg-white rounded-xl shadow-lg w-[95%] max-w-3xl p-6 relative animate-fadeIn"
      on:click|stopPropagation
    >
      <h2 class="text-xl font-semibold mb-4 text-black text-center">
        Crear nuevo usuario
      </h2>

      <form
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        on:submit|preventDefault={guardarUsuario}
      >
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-black-700">Nombre</label>
          <input
            bind:value={usuario.nombre}
            type="text"
            placeholder="Ej: Ana"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.nombre}
            <p class="text-red-500 text-sm mt-1">{errores.nombre}</p>
          {/if}
        </div>

        <!-- Apellido -->
        <div>
          <label class="block text-sm font-medium text-black-700">Apellido</label>
          <input
            bind:value={usuario.apellido}
            type="text"
            placeholder="Ej: Gómez"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.apellido}
            <p class="text-red-500 text-sm mt-1">{errores.apellido}</p>
          {/if}
        </div>

        <!-- Correo -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-black-700">Correo</label>
          <input
            bind:value={usuario.correo}
            type="email"
            placeholder="ejemplo@correo.com"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.correo}
            <p class="text-red-500 text-sm mt-1">{errores.correo}</p>
          {/if}
        </div>

        <!-- Tipo documento -->
        <div>
          <label class="block text-sm font-medium text-black-700">Tipo Documento</label>
          <select
            bind:value={usuario.tipoDocumento}
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="">Seleccione</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="NIT">NIT</option>
          </select>
          {#if errores.tipoDocumento}
            <p class="text-red-500 text-sm mt-1">{errores.tipoDocumento}</p>
          {/if}
        </div>

        <!-- Documento -->
        <div>
          <label class="block text-sm font-medium text-black-700">Número Documento</label>
          <input
            bind:value={usuario.documento}
            type="text"
            placeholder="Ej: 12345678"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.documento}
            <p class="text-red-500 text-sm mt-1">{errores.documento}</p>
          {/if}
        </div>

        <!-- Fecha nacimiento -->
        <div>
          <label class="block text-sm font-medium text-black-700">Fecha de Nacimiento</label>
          <input
            bind:value={usuario.fechaNacimiento}
            type="date"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.fechaNacimiento}
            <p class="text-red-500 text-sm mt-1">{errores.fechaNacimiento}</p>
          {/if}
        </div>

        <!-- Sexo -->
        <div>
          <label class="block text-sm font-medium text-black-700">Sexo</label>
          <select
            bind:value={usuario.sexo}
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          {#if errores.sexo}
            <p class="text-red-500 text-sm mt-1">{errores.sexo}</p>
          {/if}
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-black-700">Teléfono</label>
          <input
            bind:value={usuario.telefono}
            type="tel"
            placeholder="Ej: 3123456789"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.telefono}
            <p class="text-red-500 text-sm mt-1">{errores.telefono}</p>
          {/if}
        </div>

        <!-- Dirección -->
        <div>
          <label class="block text-sm font-medium text-black-700">Dirección</label>
          <input
            bind:value={usuario.direccion}
            type="text"
            placeholder="Ej: Calle 10 # 5-20"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.direccion}
            <p class="text-red-500 text-sm mt-1">{errores.direccion}</p>
          {/if}
        </div>

        <!-- Perfil -->
        <div>
          <label class="block text-sm font-medium text-black-700">Rol / Perfil</label>
          <select
            bind:value={usuario.perfil}
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="">Seleccione</option>
            <option value="Administrador">Administrador</option>
            <option value="Cliente">Cliente</option>
          </select>
          {#if errores.perfil}
            <p class="text-red-500 text-sm mt-1">{errores.perfil}</p>
          {/if}
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm font-medium text-black-700">Estado</label>
          <select
            bind:value={usuario.estado}
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="">Seleccione</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          {#if errores.estado}
            <p class="text-red-500 text-sm mt-1">{errores.estado}</p>
          {/if}
        </div>

        <!-- Botones -->
        <div class="col-span-2 flex justify-end mt-4 space-x-3">
          <button
            type="button"
            class="px-4 py-2 rounded-md border border-gray-300 text-black-700 hover:bg-gray-100"
            on:click={cerrarModal}
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Guardar
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
    animation: fadeIn 0.3s ease-in-out;
  }
</style>
