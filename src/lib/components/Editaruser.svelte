<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import {
    actualizarUsuario,
    fetchRoles,
    fetchAtributos,
    fetchAtributosUsuario,
    fetchPerfilCompleto,
  } from "../services/userService";
  

  const dispatch = createEventDispatcher();

  interface AtributoExistente {
    id_usuario_atributo: number;
    id_atributo: number;
    valor: string;
    nombre_atributo?: string;
    descripcion_atributo?: string;
  }

  interface AtributoNuevo {
    id_atributo: number;
    valor: string;
  }

  interface AtributoDisponible {
    id_atributo: number;
    nombre: string;
    descripcion: string;
  }

  export let visible: boolean;
  export let usuario: any = null;
  export let onClose: () => void;
  export let onSave: (data: any) => void;

  let cargando = false;
  let cargandoDatos = false;
  let roles: { id_rol: number; nombre_rol: string }[] = [];
  let atributosDisponibles: AtributoDisponible[] = [];
  let atributosOriginales: AtributoExistente[] = [];

  let formData = {
    id: 0,
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
    atributos: [] as (AtributoExistente | AtributoNuevo)[],
  };

  let errores: Record<string, string> = {};

  $: if (visible && usuario) {
    cargarDatos();
  }

  async function cargarDatos() {
    try {
      cargandoDatos = true;
      errores = {};

      // 🔹 Cargar roles y atributos
      const [rolesData, atributosData] = await Promise.all([
        fetchRoles(),
        fetchAtributos(),
      ]);
      roles = rolesData || [];
      atributosDisponibles = atributosData || [];

      // 🔹 Traer perfil completo del usuario (incluye nombre_rol si el backend lo devuelve)
      const perfil = await fetchPerfilCompleto(usuario.id);
      const atributosDelUsuario = await fetchAtributosUsuario(usuario.id);

      const u = perfil?.usuario || usuario;

      // 🔹 Rellenar datos del formulario
      formData = {
        id: usuario.id,
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.correo || "",
        tipo_documento: usuario.tipoDocumento || "",
        numero_documento: usuario.documento || "",
        fecha_nacimiento: usuario.fecha_nacimiento || "",
        sexo: usuario.sexo || "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
        id_rol: usuario.id_rol ? String(usuario.id_rol) : "",
        estado: usuario.estado === "Activo" || usuario.estado === true,
        atributos: atributosDelUsuario,
      };

      atributosOriginales = JSON.parse(JSON.stringify(atributosDelUsuario));

      console.log("✅ Usuario cargado:", formData);
    } catch (error) {
      console.error("❌ Error cargando datos:", error);
      errores.general = "Error al cargar los datos del usuario";
    } finally {
      cargandoDatos = false;
    }
  }

  function agregarAtributo() {
    formData.atributos = [...formData.atributos, { id_atributo: 0, valor: "" }];
  }

  function eliminarAtributoLocal(index: number) {
    formData.atributos = formData.atributos.filter((_, i) => i !== index);
  }

  function formatearNombreAtributo(nombre: string): string {
    return nombre
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function esAtributoExistente(attr: any): attr is AtributoExistente {
    return attr.id_usuario_atributo !== undefined;
  }

  function validarFormulario() {
    errores = {};
    if (!formData.nombre.trim()) errores.nombre = "El nombre es obligatorio.";
    if (!formData.apellido.trim())
      errores.apellido = "El apellido es obligatorio.";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errores.email = "Correo electrónico inválido.";
    if (!formData.tipo_documento)
      errores.tipo_documento = "Seleccione un tipo de documento.";
    if (!formData.numero_documento.trim())
      errores.numero_documento = "Número de documento requerido.";
    if (!formData.sexo) errores.sexo = "Seleccione el sexo.";
    if (!formData.telefono.trim())
      errores.telefono = "El teléfono es obligatorio.";
    if (!formData.direccion.trim())
      errores.direccion = "La dirección es obligatoria.";
    if (!formData.id_rol && !usuario.id_rol)
      errores.id_rol = "Seleccione un rol.";

    formData.atributos.forEach((attr, index) => {
      if (attr.id_atributo && !attr.valor.trim()) {
        errores[`atributo_${index}`] = "El valor del atributo es obligatorio.";
      }
    });

    return Object.keys(errores).length === 0;
  }

  async function guardarCambios() {
    if (!validarFormulario()) return;
    if (!formData.id) return;

    cargando = true;

    try {
      const datosActualizacion = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        tipo_documento: formData.tipo_documento,
        numero_documento: formData.numero_documento,
        sexo: formData.sexo,
        telefono: formData.telefono,
        direccion: formData.direccion,
        id_rol: formData.id_rol
          ? parseInt(formData.id_rol)
          : (usuario?.id_rol ?? undefined),
        estado: formData.estado,
        atributos: formData.atributos
          .filter((attr) => attr.id_atributo && attr.valor.trim())
          .map((attr) => ({
            id_atributo: attr.id_atributo,
            valor: attr.valor,
          })),
      };

      const resultado = await actualizarUsuario(formData.id, datosActualizacion);

      alert("Usuario actualizado exitosamente ✅");
      onSave(resultado);
      cerrarModal();
    } catch (error: any) {
      console.error("❌ Error al actualizar:", error);
      alert("Error al actualizar el usuario.");
    } finally {
      cargando = false;
    }
  }

  function cerrarModal() {
    formData = {
      id: 0,
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
      atributos: [],
    };
    errores = {};
    atributosOriginales = [];
    onClose();
  }
</script>

{#if visible && usuario}
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    on:click={cerrarModal}
  >
    <div
      class="bg-white rounded-xl shadow-lg w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative animate-fadeIn"
      on:click|stopPropagation
    >
      <h2 class="text-xl font-semibold mb-4 text-black text-center">
        Editar Usuario
      </h2>

      {#if cargandoDatos}
        <div class="flex justify-center items-center py-12">
          <div class="text-center">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"
            ></div>
            <p class="mt-4 text-gray-600">Cargando datos del usuario...</p>
          </div>
        </div>
      {:else}
        <form
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          on:submit|preventDefault={guardarCambios}
        >
          {#if errores.general}
            <div
              class="col-span-2 p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <p class="text-red-700 text-sm">{errores.general}</p>
            </div>
          {/if}

          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre</label
            >
            <input
              bind:value={formData.nombre}
              type="text"
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            {#if errores.nombre}
              <p class="text-red-500 text-sm mt-1">{errores.nombre}</p>
            {/if}
          </div>

          <!-- Apellido -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Apellido</label
            >
            <input
              bind:value={formData.apellido}
              type="text"
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
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            {#if errores.numero_documento}
              <p class="text-red-500 text-sm mt-1">
                {errores.numero_documento}
              </p>
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
            <label class="block text-sm font-medium text-gray-700"
              >Teléfono</label
            >
            <input
              bind:value={formData.telefono}
              type="tel"
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
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            {#if errores.direccion}
              <p class="text-red-500 text-sm mt-1">{errores.direccion}</p>
            {/if}
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Rol / Perfil</label>
            <select
              bind:value={formData.id_rol}
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              {#if !formData.id_rol}
                <option value="">Seleccione un rol</option>
              {/if}
              {#each roles as rol}
                <option value={rol.id_rol.toString()} selected={rol.id_rol.toString() === formData.id_rol}>
                  {rol.nombre_rol}
                </option>
              {/each}
            </select>
            {#if errores.id_rol}
              <p class="text-red-500 text-sm mt-1">{errores.id_rol}</p>
            {/if}
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label
            >
            <select
              bind:value={formData.estado}
              class="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value={true}>Activo</option>
              <option value={false}>Inactivo</option>
            </select>
          </div>

          <!-- Sección de Atributos Dinámicos -->
          <div class="sm:col-span-2 mt-4">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700">
                Atributos Personalizados
              </label>
              <button
                type="button"
                on:click={agregarAtributo}
                class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center gap-1"
              >
                <i class="bi bi-plus-lg"></i>
                Agregar Atributo
              </button>
            </div>

            {#if formData.atributos.length === 0}
              <p class="text-gray-500 text-sm italic">
                No hay atributos registrados.
              </p>
            {:else}
              <div class="space-y-3">
                {#each formData.atributos as atributo, index (index)}
                  <div
                    class="flex gap-2 items-start border border-gray-200 rounded-md p-3 bg-gray-50"
                  >
                    <div class="flex-1">
                      <label
                        class="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Seleccionar Atributo
                      </label>
                      <select
                        bind:value={atributo.id_atributo}
                        disabled={esAtributoExistente(atributo)}
                        class="w-full border border-gray-300 rounded-md p-2 text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                      >
                        <option value="">-- Seleccione un atributo --</option>
                        {#each atributosDisponibles as attr}
                          <option value={attr.id_atributo}>
                            {formatearNombreAtributo(attr.nombre)}
                          </option>
                        {/each}
                      </select>
                    </div>

                    <div class="flex-1">
                      <label
                        class="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Valor
                      </label>
                      <input
                        bind:value={atributo.valor}
                        type="text"
                        placeholder="Ingrese el valor"
                        disabled={!atributo.id_atributo}
                        class="w-full border border-gray-300 rounded-md p-2 text-sm disabled:bg-gray-100"
                      />
                      {#if errores[`atributo_${index}`]}
                        <p class="text-red-500 text-xs mt-1">
                          {errores[`atributo_${index}`]}
                        </p>
                      {/if}
                    </div>

                    <button
                      type="button"
                      on:click={() => eliminarAtributoLocal(index)}
                      class="mt-6 px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      title="Eliminar atributo"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
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
              class="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={cargando}
            >
              {cargando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
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
