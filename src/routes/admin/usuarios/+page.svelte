<script lang="ts">
  import { onMount } from "svelte";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Crearuser from "$lib/components/Crearuser.svelte";
  import Editaruser from "$lib/components/Editaruser.svelte";
  import { fetchUsuarios, fetchRoles, cambiarEstadoUsuario } from "$lib/services/userService";

  import { tieneFuncionalidad } from "$lib/stores/modulos";
  import { get } from "svelte/store";


  type Rol = {
    id_rol: number;
    nombre_rol: string;
  };

  type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    tipoDocumento: string;
    documento: string;
    correo: string;
    telefono: string;
    direccion: string;
    sexo: string;
    id_rol: number;
    perfil: string;
    estado: string;
  };

  let sortColumn: keyof Usuario = "id";
  let sortDirection: "asc" | "desc" = "asc";
  let search = "";
  let estadoFiltro = "Todos";

  let usuarios: Usuario[] = [];
  let roles: Rol[] = [];
  let loading = true;
  let errorMessage = "";

  // 🐛 FIX 1: Usar tieneFuncionalidad para 'crear' para mantener la reactividad 
  // y usar la lógica de verificación de módulo.
  $: puedeCrearUsuario = tieneFuncionalidad("Usuarios", "crear");
  $: puedeEditar = tieneFuncionalidad("Usuarios", "actualizar");
  $: puedeCambiarEstado = tieneFuncionalidad("Usuarios", "desactivar"); 

  console.log("🔐 Permisos en Usuarios:", {
    puedeCrearUsuario,
    puedeEditar,
    puedeCambiarEstado,
  });

  onMount(async () => {
    try {
      loading = true;
      errorMessage = "";

      const [rawUsuarios, rawRoles] = await Promise.all([fetchUsuarios(), fetchRoles()]);

      roles = rawRoles;

      rawUsuarios.forEach((u: any) => {
        if (u.id_usuario === undefined || u.id_usuario === null) {
          console.warn("Usuario sin id_usuario detectado:", u);
        }
      });

      usuarios = rawUsuarios
        .filter((u: any) => u.id_usuario !== undefined && u.id_usuario !== null)
        .map((u: any) => {
          const rol =
            roles.find((r) => r.id_rol === u.id_rol)?.nombre_rol ||
            "Desconocido";
          return {
            id: u.id_usuario,
            nombre: u.nombre,
            apellido: u.apellido,
            tipoDocumento: u.tipo_documento,
            documento: u.numero_documento,
            correo: u.email,
            telefono: u.telefono,
            direccion: u.direccion,
            sexo: u.sexo,
            id_rol: u.id_rol,
            perfil: rol,
            estado: u.estado === 1 || u.estado === true ? "Activo" : "Inactivo",
          };
        });
    } catch (error) {
      console.error(error);
      errorMessage = "Error al cargar usuarios o roles.";
    } finally {
      loading = false;
    }
  });

  let mostrarModal = false;

  function crearUsuario() {
    mostrarModal = true;
  }

  let usuarioEditando: Usuario | null = null;

  function editarUsuario(id: number) {
    usuarioEditando = usuarios.find((u: Usuario) => u.id === id) ?? null;
  }

  function toggleSort(column: keyof Usuario) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }
  }

  $: displayed = getSortedFiltered(
    usuarios,
    sortColumn,
    sortDirection,
    search,
    estadoFiltro
  );

  function getSortedFiltered(
    data: Usuario[] = [],
    sortColumn: keyof Usuario,
    sortDirection: "asc" | "desc",
    search: string,
    estadoFiltro: string
  ) {
    const filtered = data.filter((u: Usuario) => {
      const matchesSearch = Object.values(u)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesEstado =
        estadoFiltro === "Todos" ||
        u.estado.toLowerCase() === estadoFiltro.toLowerCase();
      return matchesSearch && matchesEstado;
    });

    const sorted = [...filtered].sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDirection === "asc" ? -1 : 1;
      if (bVal == null) return sortDirection === "asc" ? 1 : -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      return sortDirection === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return sorted;
  }

  async function toggleEstado(id: number) {
    if (!puedeCambiarEstado) {
      // 🐛 FIX 3: Reemplazar alert() por un console.error o una notificación UI.
      console.error("❌ Acceso Denegado: No tienes permisos para cambiar el estado de usuarios");
      return;
    }

    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) return;

    const nuevoEstado = usuario.estado === "Activo" ? false : true;

    try {
      await cambiarEstadoUsuario(id, nuevoEstado);

      usuarios = usuarios.map((u) =>
        u.id === id ? { ...u, estado: nuevoEstado ? "Activo" : "Inactivo" } : u
      );

      console.log(
        `✅ Estado de usuario ${id} cambiado a`,
        nuevoEstado ? "Activo" : "Inactivo"
      );
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      // alert("Error al cambiar estado del usuario."); // Evitamos el alert
    }
  }
</script>

<div class="flex items-center justify-between mb-5">
  <h2 class="text-2xl font-semibold text-black-800">Listado de usuarios</h2>
  <p>{puedeCrearUsuario}</p>
<button
    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4
  bg-[#da8780] hover:bg-[#c86c66] text-white"
    on:click={crearUsuario}
    disabled={!puedeCrearUsuario}
  >
    <i class="bi bi-plus-lg pr-2"></i>
    Crear usuario
  </button>
</div>

<div
  class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
>
  <input
    type="text"
    placeholder="Buscar"
    bind:value={search}
    class="w-full md:w-[70%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da8780]"
  />

  <select
    bind:value={estadoFiltro}
    class="border border-black-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring--[#da8780] bg-white text-black-800"
  >
    <option value="Todos">Todos los estados</option>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
  </select>
</div>

{#if loading}
  <p>Cargando usuarios...</p>
{:else if errorMessage}
  <p class="text-red-500">{errorMessage}</p>
{:else}
  <div
    class="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden mt-4"
  >
    <div
      class="overflow-x-auto max-w-[calc(150vw-18rem)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
    >
      <table class="min-w-[1200px] table-auto w-full text-sm">
        <thead
          class="bg-[#e7e7d3] text-gray-700 text-sm font-semibold tracking-wide uppercase"
        >
          <tr>
            <th
              class="text-left px-4 py-3 border-b border-gray-200 cursor-pointer"
              on:click={() => toggleSort("id")}
            >
              <div class="flex items-center gap-1.5">
                <span>ID</span>
                {#if sortColumn === "id"}
                  <i
                    class={"bi text-[0.8rem] " +
                      (sortDirection === "asc"
                        ? "bi-arrow-up"
                        : "bi-arrow-down") +
                      " text-blue-500"}
                  ></i>
                {/if}
              </div></th
            >
            <th
              class="text-left px-4 py-3 border-b border-gray-200 cursor-pointer"
              on:click={() => toggleSort("nombre")}
            >
              <div class="flex items-center gap-1.5">
                <span>Nombre</span>
                {#if sortColumn === "nombre"}
                  <i
                    class={"bi text-[0.8rem] " +
                      (sortDirection === "asc"
                        ? "bi-arrow-up"
                        : "bi-arrow-down") +
                      " text-blue-500"}
                  ></i>
                {/if}
              </div>
            </th>
            <th
              class="text-left px-4 py-3 border-b border-gray-200 cursor-pointer"
              on:click={() => toggleSort("apellido")}
            >
              <div class="flex items-center gap-1.5">
                <span>Apellido</span>
                {#if sortColumn === "apellido"}
                  <i
                    class={"bi text-[0.8rem] " +
                      (sortDirection === "asc"
                        ? "bi-arrow-up"
                        : "bi-arrow-down") +
                      " text-blue-500"}
                  ></i>
                {/if}
              </div>
            </th>
            <th class="text-left px-4 py-3 border-b border-gray-200">TipoDoc</th
            >
            <th
              class="text-left px-4 py-3 border-b border-gray-200 cursor-pointer"
              on:click={() => toggleSort("documento")}
            >
              <div class="flex items-center gap-1.5">
                <span>N° Documento</span>
                {#if sortColumn === "documento"}
                  <i
                    class={"bi text-[0.8rem] " +
                      (sortDirection === "asc"
                        ? "bi-arrow-up"
                        : "bi-arrow-down") +
                      " text-blue-500"}
                  ></i>
                {/if}
              </div>
            </th>
            <th class="text-left px-4 py-3 border-b border-gray-200"
              >Teléfono</th
            >
            <th class="text-left px-4 py-3 border-b border-gray-200"
              >Dirección</th
            >
            <th class="text-left px-4 py-3 border-b border-gray-200">Sexo</th>
            <th
              class="text-left px-4 py-3 border-b border-gray-200 cursor-pointer"
              on:click={() => toggleSort("correo")}
            >
              <div class="flex items-center gap-1.5">
                <span>Correo</span>
                {#if sortColumn === "correo"}
                  <i
                    class={"bi text-[0.8rem] " +
                      (sortDirection === "asc"
                        ? "bi-arrow-up"
                        : "bi-arrow-down") +
                      " text-blue-500"}
                  ></i>
                {/if}
              </div>
            </th>
            <th
              class="text-left px-4 py-3 border-b border-gray-200 cursor-pointer"
              on:click={() => toggleSort("perfil")}
            >
              <div class="flex items-center gap-1.5">
                <span>Perfil</span>
                {#if sortColumn === "perfil"}
                  <i
                    class={"bi text-[0.8rem] " +
                      (sortDirection === "asc"
                        ? "bi-arrow-up"
                        : "bi-arrow-down") +
                      " text-blue-500"}
                  ></i>
                {/if}
              </div>
            </th>
            <th class="text-left px-4 py-3 border-b border-gray-200">Estado</th>
            <th class="text-center px-4 py-3 border-b border-gray-200"
              >Acciones</th
            >
          </tr>
        </thead>
        <tbody>
          {#if displayed.length === 0}
            <tr>
              <td colspan="13" class="px-4 py-6 text-center text-gray-500">
                No se encontraron resultados
              </td>
            </tr>
          {:else}
            {#each displayed as u (u.id)}
              <tr
                class="even:bg-white odd:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td class="px-4 py-3 border-b border-gray-100">{u.id}</td>
                <td class="px-4 py-3 border-b border-gray-100">{u.nombre}</td>
                <td class="px-4 py-3 border-b border-gray-100">{u.apellido}</td>
                <td class="px-4 py-3 border-b border-gray-100"
                  >{u.tipoDocumento}</td
                >
                <td class="px-4 py-3 border-b border-gray-100">{u.documento}</td
                >
                <td class="px-4 py-3 border-b border-gray-100">{u.telefono}</td>
                <td class="px-4 py-3 border-b border-gray-100">{u.direccion}</td
                >
                <td class="px-4 py-3 border-b border-gray-100">{u.sexo}</td>
                <td class="px-4 py-3 border-b border-gray-100">{u.correo}</td>
                <td class="px-4 py-3 border-b border-gray-100">{u.perfil}</td>

                <td class="px-5 py-3 border-b border-gray-100 text-center">
                  <button
                    on:click={() => toggleEstado(u.id)}
                    disabled={!puedeCambiarEstado}
                    class="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    class:bg-green-500={u.estado === "Activo"}
                    class:bg-gray-400={u.estado !== "Activo"}
                  >
                    <span
                      class="inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300"
                      class:translate-x-5={u.estado === "Activo"}
                      class:translate-x-1={u.estado !== "Activo"}
                    ></span>
                  </button>
                </td>
                <td class="px-4 py-3 border-b border-gray-100 text-center">
                  <div class="inline-flex items-center gap-3">
                    {#if puedeEditar}
                      <button
                        title="Editar"
                        class="text-blue-600 hover:text-blue-800 transition"
                        on:click={() => editarUsuario(u.id)}
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                    {:else}
                      <span
                        class="text-gray-300"
                        title="Sin permisos para editar"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </span>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
{/if}

{#if mostrarModal}
  <Crearuser
    visible={mostrarModal}
    onClose={() => (mostrarModal = false)}
    on:save={async () => {
      mostrarModal = false;
      try {
        loading = true;
        const rawUsuarios = await fetchUsuarios();
        usuarios = rawUsuarios
          .filter(
            (u: any) => u.id_usuario !== undefined && u.id_usuario !== null
          )
          .map((u: any) => {
            const rol =
              roles.find((r) => r.id_rol === u.id_rol)?.nombre_rol ||
              "Desconocido";
            return {
              id: u.id_usuario,
              nombre: u.nombre,
              apellido: u.apellido,
              tipoDocumento: u.tipo_documento,
              documento: u.numero_documento,
              correo: u.email,
              telefono: u.telefono,
              direccion: u.direccion,
              sexo: u.sexo,
              id_rol: u.id_rol,
              perfil: rol,
              estado: u.estado === 1 ? "Activo" : "Inactivo",
            };
          });
      } catch (err) {
        console.error("Error al actualizar usuarios:", err);
      } finally {
        loading = false;
      }
    }}
  />
{/if}

{#if usuarioEditando}
  <Editaruser
    visible={true}
    usuario={usuarioEditando}
    onClose={() => (usuarioEditando = null)}
    onSave={(data) => {
      const index = usuarios.findIndex((u) => u.id === data.id);
      if (index !== -1) usuarios[index] = data;
      usuarioEditando = null;
    }}
  />
{/if}

<style>
  .bi {
    vertical-align: middle;
    font-size: 1.05rem;
  }
  th {
    user-select: none;
  }
</style>
