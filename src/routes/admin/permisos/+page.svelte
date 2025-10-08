<script lang="ts">
  import "bootstrap-icons/font/bootstrap-icons.css";
  import { Button } from "$lib/components/ui/button";
  import Editarpermiso from "$lib/components/Editarpermiso.svelte";
  import Crearpermiso from "$lib/components/Crearpermiso.svelte";

  type Perfil = {
    id: number;
    nombre: string;
    estado: "Activo" | "Inactivo";
  };

  let perfiles: Perfil[] = [
    { id: 1, nombre: "Administrador", estado: "Activo" },
    { id: 2, nombre: "Ventanilla", estado: "Activo" },
    { id: 3, nombre: "Coordinación", estado: "Activo" },
    { id: 4, nombre: "Visualizador", estado: "Activo" },
    { id: 5, nombre: "Turnero", estado: "Activo" },
    { id: 6, nombre: "Turnero autogestión", estado: "Activo" },
  ];

  let sortColumn: keyof Perfil = "id";
  let sortDirection: "asc" | "desc" = "asc";
  let search = "";
  let estadoFiltro = "Todos";

  let mostrarModalEditar = false;
  let mostrarModalCrear = false;
  let perfilSeleccionado: Perfil | null = null;

  function abrirModalCrear() {
    mostrarModalCrear = true;
  }

  function abrirModalEditar(p: Perfil) {
    perfilSeleccionado = { ...p };
    mostrarModalEditar = true;
  }

  function toggleSort(column: keyof Perfil) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }
  }

  $: displayed = getSortedFiltered(
    perfiles,
    sortColumn,
    sortDirection,
    search,
    estadoFiltro
  );

  function getSortedFiltered(
    data: Perfil[],
    sortColumn: keyof Perfil,
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
    perfiles = perfiles.map((p) =>
      p.id === id
        ? { ...p, estado: p.estado === "Activo" ? "Inactivo" : "Activo" }
        : p
    );
  }
</script>

<div class="flex items-center justify-between mb-5">
  <h2 class="text-2xl font-semibold text-gray-800">Listado de perfiles</h2>
  <button
    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4
         bg-[#da8780] hover:bg-[#c86c66] text-white"
    on:click={abrirModalCrear}
  >
    <i class="bi bi-plus-lg"></i>
    Crear perfil
  </button>
</div>

<div
  class="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between"
>
  <input
    type="text"
    placeholder="Buscar perfil..."
    bind:value={search}
    class="w-full md:w-[70%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#da8780]"
  />

  <select
    bind:value={estadoFiltro}
    class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#da8780]"
  >
    <option value="Todos">Todos los estados</option>
    <option value="Activo">Activo</option>
    <option value="Inactivo">Inactivo</option>
  </select>
</div>

<div
  class="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
>
  <table class="min-w-full text-sm text-gray-800">
    <thead class="bg-[#e7e7d3] text-gray-700 font-semibold uppercase text-sm">
      <tr>
        <th
          class="px-4 py-3 text-left cursor-pointer"
          on:click={() => toggleSort("id")}
        >
          <div class="flex items-center gap-1.5">
            <span>No.</span>
            {#if sortColumn === "id"}
              <i
                class={"bi " +
                  (sortDirection === "asc" ? "bi-arrow-up" : "bi-arrow-down")}
              ></i>
            {/if}
          </div>
        </th>
        <th
          class="px-4 py-3 text-left cursor-pointer"
          on:click={() => toggleSort("nombre")}
        >
          <div class="flex items-center gap-1.5">
            <span>Nombre Perfil</span>
            {#if sortColumn === "nombre"}
              <i
                class={"bi " +
                  (sortDirection === "asc" ? "bi-arrow-up" : "bi-arrow-down")}
              ></i>
            {/if}
          </div>
        </th>
        <th class="px-4 py-3 text-center">Estado</th>
        <th class="px-4 py-3 text-center">Acción</th>
      </tr>
    </thead>
    <tbody>
      {#if displayed.length === 0}
        <tr>
          <td colspan="4" class="text-center py-6 text-gray-500">
            No se encontraron perfiles.
          </td>
        </tr>
      {:else}
        {#each displayed as p (p.id)}
          <tr class="even:bg-white odd:bg-gray-50 hover:bg-gray-100 transition">
            <td class="px-4 py-3 border-b">{p.id}</td>
            <td class="px-4 py-3 border-b">{p.nombre}</td>
            <td class="px-5 py-3 border-b border-gray-100 text-center">
              <button
                on:click={() => toggleEstado(p.id)}
                class="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none"
                class:bg-green-500={p.estado === "Activo"}
                class:bg-gray-400={p.estado !== "Activo"}
              >
                <span
                  class="inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-300"
                  class:translate-x-5={p.estado === "Activo"}
                  class:translate-x-1={p.estado !== "Activo"}
                ></span>
              </button>
            </td>
            <td class="px-4 py-3 border-b text-center">
              <button
                class="text-blue-600 hover:text-blue-800"
                on:click={() => abrirModalEditar(p)}
                title="Ver / Editar"
              >
                <i class="bi bi-pencil-square"></i>
              </button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

{#if mostrarModalEditar && perfilSeleccionado}
  <Editarpermiso
    visible={true}
    perfil={perfilSeleccionado}
    onClose={() => (perfilSeleccionado = null)}
    onSave={(data) => {
      const index = perfiles.findIndex((u) => u.id === data.id);
      if (index !== -1) perfiles[index] = data;
      perfilSeleccionado = null;
    }}
  />
{/if}

{#if mostrarModalCrear}
  <Crearpermiso visible={mostrarModalCrear} onClose={() => (mostrarModalCrear = false)} />
{/if}
