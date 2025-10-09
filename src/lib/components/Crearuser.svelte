<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { crearUsuario } from "../services/userService"; // 👈 importa el servicio
  import { onMount } from "svelte";

  export let visible: boolean;
  export let onClose: () => void;

  const dispatch = createEventDispatcher();

  let cargando = false;

  // Datos del formulario
  let formData = {
    usuario: "",
    contrasena: "",
    nombre: "",
    apellido: "",
    email: "",
    tipo_documento: "",
    numero_documento: "",
    fecha_nacimiento: "",
    sexo: "",
    telefono: "",
    direccion: "",
    id_rol: "",
    estado: true,
  };

  // Errores de validación
  let errores: Record<string, string> = {};

  function cerrarModal() {
    formData = {
      usuario: "",
      contrasena: "",
      nombre: "",
      apellido: "",
      email: "",
      tipo_documento: "",
      numero_documento: "",
      fecha_nacimiento: "",
      sexo: "",
      telefono: "",
      direccion: "",
      id_rol: "",
      estado: true,
    };
    errores = {};
    onClose();
  }

  function validarFormulario() {
    errores = {};

    if (!formData.usuario.trim())
      errores.usuario = "El nombre de usuario es obligatorio.";
    if (!formData.contrasena || formData.contrasena.length < 8)
      errores.contrasena = "La contraseña debe tener al menos 8 caracteres.";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.contrasena))
      errores.contrasena = "Debe incluir un símbolo especial.";

    if (!formData.nombre.trim()) errores.nombre = "El nombre es obligatorio.";
    if (!formData.apellido.trim())
      errores.apellido = "El apellido es obligatorio.";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errores.email = "Correo electrónico inválido.";
    if (!formData.tipo_documento)
      errores.tipo_documento = "Seleccione un tipo de documento.";
    if (!formData.numero_documento.trim())
      errores.numero_documento = "Número de documento requerido.";
    if (!formData.fecha_nacimiento.trim())
      errores.fecha_nacimiento = "Seleccione una fecha de nacimiento.";
    if (!formData.sexo) errores.sexo = "Seleccione el sexo.";
    if (!formData.telefono.trim())
      errores.telefono = "El teléfono es obligatorio.";
    if (!formData.direccion.trim())
      errores.direccion = "La dirección es obligatoria.";
    if (!formData.id_rol) errores.id_rol = "Seleccione un rol.";

    return Object.keys(errores).length === 0;
  }

  async function guardarUsuario() {
    if (!validarFormulario()) return;
    cargando = true;

    const usuarioPayload = {
      usuario: formData.usuario,
      contrasena: formData.contrasena,
      nombre: formData.nombre,
      apellido: formData.apellido,
      tipo_documento: formData.tipo_documento,
      numero_documento: formData.numero_documento,
      fecha_nacimiento: formData.fecha_nacimiento,
      sexo: formData.sexo,
      telefono: formData.telefono,
      email: formData.email,
      direccion: formData.direccion,
      estado: formData.estado,
      id_rol: parseInt(formData.id_rol),
    };

    console.log("📦 Enviando usuario al backend:", usuarioPayload);

    try {
      const respuesta = await crearUsuario(usuarioPayload);
      console.log("✅ Usuario creado:", respuesta);

      alert("Usuario creado exitosamente ✅");
      dispatch("save", respuesta);
      cerrarModal();
    } catch (error: unknown) {
      console.error("❌ Error al crear usuario:", error);
      let mensaje = "Error al guardar el usuario.";

      if (error instanceof Error) {
        mensaje += " " + error.message;
      }

      alert(mensaje);
    } finally {
      cargando = false;
    }
  }

  // Generar contraseña automática
  function generarContrasenaAutomatica() {
    if (formData.numero_documento.trim()) {
      formData.contrasena = formData.numero_documento + "!";
    }
  }
</script>

{#if visible}
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    on:click={cerrarModal}
  >
    <div
      class="bg-white rounded-xl shadow-lg w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative animate-fadeIn"
      on:click|stopPropagation
    >
      <h2 class="text-xl font-semibold mb-4 text-black text-center">
        Crear nuevo usuario
      </h2>

      <form
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        on:submit|preventDefault={guardarUsuario}
      >
        <!-- Usuario -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Usuario</label>
          <input
            bind:value={formData.usuario}
            type="text"
            placeholder="Ej: ana.gomez"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.usuario}
            <p class="text-red-500 text-sm mt-1">{errores.usuario}</p>
          {/if}
        </div>

        <!-- Contraseña -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700"
            >Contraseña</label
          >
          <div class="flex gap-2">
            <input
              bind:value={formData.contrasena}
              type="password"
              placeholder="********"
              class="flex-1 border border-gray-300 rounded-md p-2 mt-1"
            />
            <button
              type="button"
              on:click={generarContrasenaAutomatica}
              class="mt-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Auto
            </button>
          </div>
          {#if errores.contrasena}
            <p class="text-red-500 text-sm mt-1">{errores.contrasena}</p>
          {/if}
        </div>

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            bind:value={formData.nombre}
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
          <label class="block text-sm font-medium text-gray-700">Apellido</label
          >
          <input
            bind:value={formData.apellido}
            type="text"
            placeholder="Ej: Gómez"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.apellido}
            <p class="text-red-500 text-sm mt-1">{errores.apellido}</p>
          {/if}
        </div>

        <!-- Email -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700"
            >Correo electrónico</label
          >
          <input
            bind:value={formData.email}
            type="email"
            placeholder="ejemplo@correo.com"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.email}
            <p class="text-red-500 text-sm mt-1">{errores.email}</p>
          {/if}
        </div>

        <!-- Tipo documento -->
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Tipo Documento</label
          >
          <select
            bind:value={formData.tipo_documento}
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="">Seleccione</option>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="NIT">NIT</option>
          </select>
          {#if errores.tipo_documento}
            <p class="text-red-500 text-sm mt-1">{errores.tipo_documento}</p>
          {/if}
        </div>

        <!-- Documento -->
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Número Documento</label
          >
          <input
            bind:value={formData.numero_documento}
            type="text"
            placeholder="Ej: 12345678"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.numero_documento}
            <p class="text-red-500 text-sm mt-1">{errores.numero_documento}</p>
          {/if}
        </div>

        <!-- Fecha -->
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Fecha Nacimiento</label
          >
          <input
            bind:value={formData.fecha_nacimiento}
            type="date"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.fecha_nacimiento}
            <p class="text-red-500 text-sm mt-1">{errores.fecha_nacimiento}</p>
          {/if}
        </div>

        <!-- Sexo -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Sexo</label>
          <select
            bind:value={formData.sexo}
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="">Seleccione</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
          {#if errores.sexo}
            <p class="text-red-500 text-sm mt-1">{errores.sexo}</p>
          {/if}
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Teléfono</label
          >
          <input
            bind:value={formData.telefono}
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
          <label class="block text-sm font-medium text-gray-700"
            >Dirección</label
          >
          <input
            bind:value={formData.direccion}
            type="text"
            placeholder="Ej: Calle 10 #5-20"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
          {#if errores.direccion}
            <p class="text-red-500 text-sm mt-1">{errores.direccion}</p>
          {/if}
        </div>

        <!-- Rol -->
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Rol / Perfil</label
          >
          <select
            bind:value={formData.id_rol}
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="">Seleccione</option>
            <option value="1">Administrador</option>
            <option value="2">Asistente</option>
          </select>
          {#if errores.id_rol}
            <p class="text-red-500 text-sm mt-1">{errores.id_rol}</p>
          {/if}
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Estado</label>
          <select
            bind:value={formData.estado}
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value={true}>Activo</option>
            <option value={false}>Inactivo</option>
          </select>
        </div>

        <!-- Botones -->
        <div class="col-span-2 flex justify-end mt-4 gap-3">
          <button
            type="button"
            class="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            on:click={cerrarModal}
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            disabled={cargando}
          >
            {#if cargando}
              Guardando...
            {/if}
            {#if !cargando}
              Guardar Usuario
            {/if}
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
