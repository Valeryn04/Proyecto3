<script lang="ts">
  let filtros = {
    fechaInicio: '',
    fechaFin: '',
    paciente: '',
    medico: '',
    tipoConsulta: '',
    estado: ''
  };

  let resultados = [
    {
      id: 'HC-001',
      fecha: '2025-10-15',
      paciente: 'María González',
      medico: 'Dr. Carlos Ramírez',
      tipoConsulta: 'Consulta General',
      diagnostico: 'Hipertensión arterial',
      estado: 'Completada'
    },
    {
      id: 'HC-002',
      fecha: '2025-10-14',
      paciente: 'Juan Pérez',
      medico: 'Dra. Ana Martínez',
      tipoConsulta: 'Control',
      diagnostico: 'Diabetes tipo 2 - Control',
      estado: 'Completada'
    },
    {
      id: 'HC-003',
      fecha: '2025-10-14',
      paciente: 'Pedro López',
      medico: 'Dr. Luis Torres',
      tipoConsulta: 'Urgencia',
      diagnostico: 'Dolor abdominal agudo',
      estado: 'En proceso'
    },
    {
      id: 'HC-004',
      fecha: '2025-10-13',
      paciente: 'Laura Sánchez',
      medico: 'Dra. Ana Martínez',
      tipoConsulta: 'Consulta General',
      diagnostico: 'Gripe estacional',
      estado: 'Completada'
    }
  ];

  function getEstadoBadge(estado: string): string {
    const colores: Record<string, string> = {
      'Completada': 'badge-success',
      'En proceso': 'badge-warning',
      'Pendiente': 'badge-secondary'
    };
    return colores[estado] || 'badge-secondary';
  }
</script>

<div class="container">
  <div class="header">
    <i class="bi bi-search"></i>
    <h1>Búsqueda de Historias Clínicas</h1>
  </div>

  <div class="card">
    <h2>Filtros de Búsqueda</h2>

    <div class="grid">
      <div class="field">
        <label>Paciente</label>
        <input type="text" placeholder="Buscar paciente..." bind:value={filtros.paciente} />
      </div>

      <div class="field">
        <label>Médico</label>
        <input type="text" placeholder="Buscar médico..." bind:value={filtros.medico} />
      </div>

      <div class="field">
        <label>Tipo de Consulta</label>
        <select bind:value={filtros.tipoConsulta}>
          <option value="">Todos</option>
          <option value="general">Consulta General</option>
          <option value="control">Control</option>
          <option value="urgencia">Urgencia</option>
          <option value="especialidad">Especialidad</option>
        </select>
      </div>

      <div class="field">
        <label>Fecha Inicio</label>
        <input type="date" bind:value={filtros.fechaInicio} />
      </div>

      <div class="field">
        <label>Fecha Fin</label>
        <input type="date" bind:value={filtros.fechaFin} />
      </div>

      <div class="field">
        <label>Estado</label>
        <select bind:value={filtros.estado}>
          <option value="">Todos</option>
          <option value="completada">Completada</option>
          <option value="proceso">En proceso</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary">
        <i class="bi bi-search"></i>
        Buscar
      </button>
      <button class="btn btn-secondary">
        <i class="bi bi-arrow-clockwise"></i>
        Limpiar
      </button>
    </div>
  </div>

  <div class="card">
    <div class="flex-between">
      <h3>Resultados ({resultados.length})</h3>
      <button class="btn btn-dark">
        <i class="bi bi-download"></i>
        Exportar
      </button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Paciente</th>
          <th>Médico</th>
          <th>Tipo</th>
          <th>Diagnóstico</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each resultados as resultado}
          <tr>
            <td class="font-medium">{resultado.id}</td>
            <td>{resultado.fecha}</td>
            <td>{resultado.paciente}</td>
            <td>{resultado.medico}</td>
            <td>{resultado.tipoConsulta}</td>
            <td>{resultado.diagnostico}</td>
            <td>
              <span class="badge {getEstadoBadge(resultado.estado)}">
                {resultado.estado}
              </span>
            </td>
            <td>
              <button class="btn-icon"><i class="bi bi-eye"></i></button>
              <button class="btn-icon"><i class="bi bi-robot"></i></button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css');

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .header i {
    font-size: 2rem;
    color: #da8780;
  }

  .header h1 {
    font-size: 1.875rem;
    color: #2e4750;
  }

  .card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e5e7eb;
  }

  .card h2,
  .card h3 {
    font-size: 1.125rem;
    color: #2e4750;
    margin-bottom: 1rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .field label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  input,
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #da8780;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .btn-primary {
    background: #da8780;
    color: white;
  }

  .btn-secondary {
    background: #e5e7eb;
    color: #374151;
  }

  .btn-dark {
    background: #2e4750;
    color: white;
  }

  .btn-icon {
    background: transparent;
    border: none;
    color: #6b7280;
    padding: 0.25rem;
    cursor: pointer;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 0.75rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    border-bottom: 1px solid #e5e7eb;
  }

  td {
    padding: 0.75rem;
    font-size: 0.875rem;
    border-bottom: 1px solid #f3f4f6;
  }

  .font-medium {
    font-weight: 600;
  }

  .badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .badge-success {
    background: #dcfce7;
    color: #15803d;
  }

  .badge-warning {
    background: #fef3c7;
    color: #a16207;
  }

  .badge-secondary {
    background: #f3f4f6;
    color: #374151;
  }
</style>