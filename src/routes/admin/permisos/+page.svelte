<script lang="ts">
  import "bootstrap-icons/font/bootstrap-icons.css";
  import { Button } from "$lib/components/ui/button";
  import Editarpermiso from "$lib/components/Editarpermiso.svelte";
  import Crearpermiso from "$lib/components/Crearpermiso.svelte";
  import { fetchRoles } from "$lib/services/userService";
  import { onMount } from "svelte";
  import { permisos, tieneFuncionalidad } from "$lib/stores/modulos"; // Asegúrate de importar la función `tieneFuncionalidad`

  type Perfil = {
    id_rol: number;
    nombre_rol: string;
    descripcion?: string;
    estado?: "Activo" | "Inactivo";
  };

  let perfiles: Perfil[] = [];
  let sortColumn: keyof Perfil = "id_rol";
  let sortDirection: "asc" | "desc" = "asc";
  let search = "";
  let estadoFiltro = "Todos";

  let mostrarModalEditar = false;
  let mostrarModalCrear = false;
  let perfilSeleccionado: Perfil | null = null;

  // 🔹 Cargar roles desde la API al iniciar
  onMount(async () => {
    try {
      const data = await fetchRoles();
      perfiles = data.map((r: any) => ({
        id_rol: r.id_rol,
        nombre_rol: r.nombre_rol || r.nombre,
        descripcion: r.descripcion,
        estado: "Activo",
      }));
      console.log("✅ Perfiles cargados:", perfiles);
    } catch (error) {
      console.error("❌ Error cargando roles:", error);
    }
  });

  $: puedeCrearPerfil = tieneFuncionalidad("Permisos", "crear");
  $: puedeEditarPerfil = tieneFuncionalidad("Permisos", "actualizar");
  $: puedeConsultarPerfil = tieneFuncionalidad("Permisos", "consultar");

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
        u.estado?.toLowerCase() === estadoFiltro.toLowerCase();
      return matchesSearch && matchesEstado;
    });

    const sorted = [...filtered].sort((a, b) => {
      const aVal = (a as any)[sortColumn];
      const bVal = (b as any)[sortColumn];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return sorted;
  }

  function toggleEstado(id_rol: number) {
    perfiles = perfiles.map((p) =>
      p.id_rol === id_rol
        ? { ...p, estado: p.estado === "Activo" ? "Inactivo" : "Activo" }
        : p
    );
  }

  // ✅ Función para cerrar el modal de editar
  function cerrarModalEditar() {
    mostrarModalEditar = false;
    perfilSeleccionado = null;
  }

  // ✅ Función para guardar cambios del perfil editado
  function guardarPerfil(data: Perfil) {
    const index = perfiles.findIndex((p) => p.id_rol === data.id_rol);
    if (index !== -1) {
      perfiles[index] = data;
    }
    cerrarModalEditar();
  }
</script>

<div class="flex items-center justify-between mb-5">
  <h2 class="text-2xl font-semibold text-gray-800">Listado de perfiles</h2>
  {#if puedeCrearPerfil}
    <button
      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4
         bg-[#da8780] hover:bg-[#c86c66] text-white"
      on:click={abrirModalCrear}
    >
      <i class="bi bi-plus-lg"></i>
      Crear perfil
    </button>
  {/if}
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

{#if puedeConsultarPerfil}
  <div
    class="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
  >
    <table class="min-w-full text-sm text-gray-800">
      <thead class="bg-[#e7e7d3] text-gray-700 font-semibold uppercase text-sm">
        <tr>
          <th
            class="px-4 py-3 text-left cursor-pointer w-[8%]"
            on:click={() => toggleSort("id_rol")}
          >
            <div class="flex items-center gap-1.5">
              <span>No.</span>
              {#if sortColumn === "id_rol"}
                <i
                  class={"bi " +
                    (sortDirection === "asc" ? "bi-arrow-up" : "bi-arrow-down")}
                ></i>
              {/if}
            </div>
          </th>
          <th
            class="px-4 py-3 text-left cursor-pointer w-[25%]"
            on:click={() => toggleSort("nombre_rol")}
          >
            <div class="flex items-center gap-1.5">
              <span>Nombre Perfil</span>
              {#if sortColumn === "nombre_rol"}
                <i
                  class={"bi " +
                    (sortDirection === "asc" ? "bi-arrow-up" : "bi-arrow-down")}
                ></i>
              {/if}
            </div>
          </th>
          <th
            class="px-4 py-3 text-left cursor-pointer w-[50%]"
            on:click={() => toggleSort("descripcion")}
          >
            <div class="flex items-center gap-1.5">
              <span>Descripción</span>
              {#if sortColumn === "descripcion"}
                <i
                  class={"bi " +
                    (sortDirection === "asc" ? "bi-arrow-up" : "bi-arrow-down")}
                ></i>
              {/if}
            </div>
          </th> <th class="px-4 py-3 text-center w-[17%]">Acción</th>
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
          {#each displayed as p (p.id_rol)}
            <tr
              class="even:bg-white odd:bg-gray-50 hover:bg-gray-100 transition"
            >
              <td class="px-4 py-3 border-b">{p.id_rol}</td>
              <td class="px-4 py-3 border-b">{p.nombre_rol}</td>
              <td class="px-4 py-3 border-b">{p.descripcion}</td>
              <td class="px-4 py-3 border-b text-center">
                {#if puedeEditarPerfil}
                  <button
                    class="text-blue-600 hover:text-blue-800"
                    on:click={() => abrirModalEditar(p)}
                    title="Ver / Editar"
                    disabled={!puedeEditarPerfil}
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
{/if}

{#if mostrarModalEditar && perfilSeleccionado}
  <Editarpermiso
    visible={mostrarModalEditar}
    perfil={perfilSeleccionado}
    onClose={cerrarModalEditar}
    onSave={guardarPerfil}
  />
{/if}

{#if mostrarModalCrear}
  <Crearpermiso
    visible={mostrarModalCrear}
    onClose={() => (mostrarModalCrear = false)}
  />
{/if}
