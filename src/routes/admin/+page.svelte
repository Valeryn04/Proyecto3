<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	let pacientesChartCanvas: HTMLCanvasElement;
	let historiasChartCanvas: HTMLCanvasElement;
	let usuariosChartCanvas: HTMLCanvasElement;


	// Datos para historias clínicas
	const historiasData = {
		labels: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"],
		datasets: [
			{
				label: 'Historias X Mes',
				data: [32, 45, 38, 41, 52, 48],
				backgroundColor: '#10b981',
			}
		]
	};

	// Distribución de usuarios por rol
	const usuariosData = {
		labels: ['Médicos', 'Enfermeras', 'Administrativos', 'Especialistas'],
		datasets: [{
			data: [24, 35, 18, 12],
			backgroundColor: [
				'#a855f7',
				'#ec4899',
				'#6366f1',
				'#8b5cf6'
			],
			borderWidth: 0
		}]
	};

	// Estadísticas rápidas
	const stats = {
		totalPacientes: 256,
		historias: 223,
		totalUsuarios: 89,
	};

	onMount(() => {
		// Gráfico de Historias Clínicas (Bar Chart)
		new Chart(historiasChartCanvas, {
			type: 'bar',
			data: historiasData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							usePointStyle: true,
							padding: 2,
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							color: 'rgba(0, 0, 0, 0.05)'
						}
					},
					x: {
						grid: {
							display: false
						}
					}
				}
			}
		});

		// Gráfico de Usuarios (Doughnut Chart)
		new Chart(usuariosChartCanvas, {
			type: 'doughnut',
			data: usuariosData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							usePointStyle: true,
							padding: 15
						}
					}
				}
			}
		});
	});

</script>

<section class="grid gap-6">

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="p-6 bg-white border border-[#cac4a4] rounded-xl shadow-sm hover:shadow-md transition-shadow">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="font-semibold text-black text-lg">Pacientes</h3>
					<p class="text-3xl font-bold text-black mt-2">{stats.totalPacientes}</p>
				</div>
				<div class="p-2 bg-blue-100 rounded-full">
          <i class="bi bi-person-heart w-50 h-50 text-blue-600 text-3xl"></i>
				</div>
			</div>
			<p class="text-sm text-gray-600 mt-1">Total registrados</p>
		</div>

		<div class="p-6 bg-white border border-[#cac4a4] rounded-xl shadow-sm hover:shadow-md transition-shadow">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="font-semibold text-black text-lg">Historias Clínicas</h3>
					<p class="text-3xl font-bold text-black mt-2">{stats.historias}</p>
				</div>
				<div class="p-3 bg-green-100 rounded-full">
          <i class="bi bi-file-earmark-text-fill w-50 h-50 text-green-600 text-3xl"></i>
				</div>
			</div>
			<p class="text-sm text-gray-600 mt-1">Registros médicos</p>
		</div>

		<div class="p-6 bg-white border border-[#cac4a4] rounded-xl shadow-sm hover:shadow-md transition-shadow">
			<div class="flex items-center justify-between">
				<div>
					<h3 class="font-semibold text-black text-lg">Usuarios</h3>
					<p class="text-3xl font-bold text-black mt-2">{stats.totalUsuarios}</p>
					<p class="text-sm text-gray-600 mt-1">Personal activo</p>
				</div>
				<div class="p-3 bg-purple-100 rounded-full">
          <i class="bi bi-people-fill w-50 h-50 text-purple-600 text-3xl"></i>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<Card.Root class="border-[#cac4a4]">
			<Card.Header>
				<Card.Title class="text-black">Historias Clínicas</Card.Title>
				<Card.Description>Creadas, actualizadas, revisadas</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="h-80">
					<canvas bind:this={historiasChartCanvas}></canvas>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="border-[#cac4a4]">
			<Card.Header>
				<Card.Title class="text-black">Usuarios por Rol</Card.Title>
				<Card.Description>Distribución del personal</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="h-80 flex items-center justify-center">
					<canvas bind:this={usuariosChartCanvas}></canvas>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Resumen de reportes -->
	<Card.Root class="border-[#cac4a4]">
		<Card.Header>
			<Card.Title class="text-black">Resumen de Reportes</Card.Title>
			<Card.Description>Métricas clave del sistema</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
					
				</div>
				<div class="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
					
				</div>
				<div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
					
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</section>