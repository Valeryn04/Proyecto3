<script lang="ts">
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Crearuser from "$lib/components/Crearuser.svelte";
  import Editaruser from "$lib/components/Editaruser.svelte";

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
    perfil: string;
    estado: string;
  };

  let sortColumn: keyof Usuario = "id";
  let sortDirection: "asc" | "desc" = "asc";
  let search = "";
  let estadoFiltro = "Todos";

  let usuarios: Usuario[] = [
    {
      id: 1,
      nombre: "Administrador",
      apellido: "SpaceIS",
      tipoDocumento: "CC",
      documento: "123456887",
      correo: "administrador@yopmail.com",
      telefono: "3105678999",
      direccion: "Calle 45 #23-12",
      sexo: "Femenino",
      perfil: "Administrador",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Carolina",
      apellido: "Caicedo",
      tipoDocumento: "CC",
      documento: "38552034",
      correo: "ccaicedo@mcc.com.co",
      telefono: "3012345678",
      direccion: "Carrera 56 #12-80",
      sexo: "Femenino",
      perfil: "Administrador",
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Daniel",
      apellido: "Soto",
      tipoDocumento: "CC",
      documento: "333333333",
      correo: "dsoto@barranquilla.gov.co",
      telefono: "3009876543",
      direccion: "Av. Las Palmas 123",
      sexo: "Masculino",
      perfil: "Administrador",
      estado: "Inactivo",
    },
  ];

  let mostrarModal = false;

  function crearUsuario() {
    mostrarModal = true;
  }

  let usuarioEditando: any = null;

  function editarUsuario(id: number) {
    usuarioEditando = usuarios.find((u) => u.id === id);
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
    data: Usuario[],
    sortColumn: keyof Usuario,
    sortDirection: "asc" | "desc",
    search: string,
    estadoFiltro: string
  ) {
    const filtered = data.filter((u) => {
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

 function toggleEstado(id: number) {
  usuarios = usuarios.map((u) =>
    u.id === id
      ? { ...u, estado: u.estado === "Activo" ? "Inactivo" : "Activo" }
      : u
  );
}
</script>

<div class="flex items-center justify-between mb-5">
  <h2 class="text-2xl font-semibold text-black-800">Listado de usuarios</h2>
  <button
    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4
         bg-[#da8780] hover:bg-[#c86c66] text-white"
    on:click={crearUsuario}
  >
    <i class="bi bi-plus-lg"></i>
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

          <!-- NOMBRE -->
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

          <!-- APELLIDO -->
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

          <!-- TIPO DOCUMENTO -->
          <th class="text-left px-4 py-3 border-b border-gray-200">TipoDoc </th>

          <!-- DOCUMENTO -->
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

          <!-- TELÉFONO -->
          <th class="text-left px-4 py-3 border-b border-gray-200"
            >Teléfono
          </th>

          <!-- DIRECCIÓN -->
          <th class="text-left px-4 py-3 border-b border-gray-200"
            >Dirección
          </th>

          <!-- SEXO -->
          <th class="text-left px-4 py-3 border-b border-gray-200">Sexo </th>

          <!-- CORREO -->
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

          <!-- PERFIL -->
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

          <!-- ESTADO -->
          <th class="text-left px-4 py-3 border-b border-gray-200">Estado </th>

          <!-- ACCIONES -->
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
              <td class="px-4 py-3 border-b border-gray-100">{u.documento}</td>
              <td class="px-4 py-3 border-b border-gray-100">{u.telefono}</td>
              <td class="px-4 py-3 border-b border-gray-100">{u.direccion}</td>
              <td class="px-4 py-3 border-b border-gray-100">{u.sexo}</td>
              <td class="px-4 py-3 border-b border-gray-100">{u.correo}</td>
              <td class="px-4 py-3 border-b border-gray-100">{u.perfil}</td>

              <td class="px-5 py-3 border-b border-gray-100 text-center">
                <button
                  on:click={() => toggleEstado(u.id)}
                  class="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none"
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

              <!-- Acciones -->
              <td class="px-4 py-3 border-b border-gray-100 text-center">
                <div class="inline-flex items-center gap-3">
                  <button
                    title="Editar"
                    class="text-blue-600 hover:text-blue-800 transition"
                    on:click={() => editarUsuario(u.id)}
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

{#if mostrarModal}
  <Crearuser visible={mostrarModal} onClose={() => (mostrarModal = false)} />
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
