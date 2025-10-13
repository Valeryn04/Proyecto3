<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';

  function handleLogin() {
    goto('/login');
  }
</script>

<svelte:head>
  <title>DermaIA - Sistema Inteligente de Gestión Dermatológica</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
  <!-- Navbar -->
  <nav class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-2">
          <i class="bi bi-heart-pulse text-3xl text-purple-600"></i>
          <span class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            DermaIA
          </span>
        </div>
        <Button onclick={handleLogin} class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <i class="bi bi-box-arrow-in-right mr-2"></i>
          Iniciar Sesión
        </Button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="pt-32 pb-20 px-4 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white mt-16">
    <div class="max-w-7xl mx-auto text-center">
      <Badge class="mb-6 bg-white/20 text-white border-white/30 text-lg px-4 py-2 hover:bg-white/30">
        Innovación en Salud Dermatológica
      </Badge>
      <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        Sistema Inteligente de Gestión Dermatológica
      </h1>
      <p class="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
        Optimiza la gestión de historias clínicas y detecta riesgos tempranos con inteligencia artificial
      </p>
      <Button onclick={handleLogin} size="lg" class="bg-white text-purple-600 hover:bg-gray-100 text-lg">
        <i class="bi bi-rocket-takeoff mr-2"></i>
        Comenzar Ahora
      </Button>
    </div>
  </section>

  <!-- Features Section -->
  <section class="py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Funcionalidades Principales</h2>
        <div class="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Feature Card 1 -->
        <Card class="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200">
          <CardHeader>
            <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <i class="bi bi-file-medical text-white text-3xl"></i>
            </div>
            <CardTitle class="text-xl">Gestión de Historias Clínicas</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-base">
              Sistema completo para el registro, actualización y consulta de historias clínicas dermatológicas de manera digital y segura.
            </CardDescription>
          </CardContent>
        </Card>

        <!-- Feature Card 2 -->
        <Card class="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200">
          <CardHeader>
            <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <i class="bi bi-cpu text-white text-3xl"></i>
            </div>
            <CardTitle class="text-xl">Análisis con IA</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-base">
              Algoritmos de inteligencia artificial que analizan patrones clínicos para apoyar el diagnóstico y la detección temprana de riesgos.
            </CardDescription>
          </CardContent>
        </Card>

        <!-- Feature Card 3 -->
        <Card class="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200">
          <CardHeader>
            <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <i class="bi bi-shield-check text-white text-3xl"></i>
            </div>
            <CardTitle class="text-xl">Seguridad y Privacidad</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-base">
              Cumplimiento de normativas de protección de datos médicos con cifrado y control de acceso basado en roles.
            </CardDescription>
          </CardContent>
        </Card>

        <!-- Feature Card 4 -->
        <Card class="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200">
          <CardHeader>
            <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <i class="bi bi-graph-up-arrow text-white text-3xl"></i>
            </div>
            <CardTitle class="text-xl">Análisis Predictivo</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-base">
              Identificación de tendencias y patrones en datos clínicos para la detección temprana de condiciones dermatológicas.
            </CardDescription>
          </CardContent>
        </Card>

        <!-- Feature Card 5 -->
        <Card class="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200">
          <CardHeader>
            <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <i class="bi bi-people text-white text-3xl"></i>
            </div>
            <CardTitle class="text-xl">Gestión de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-base">
              Base de datos centralizada con información completa de pacientes, citas, tratamientos y seguimientos.
            </CardDescription>
          </CardContent>
        </Card>

        <!-- Feature Card 6 -->
        <Card class="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-200">
          <CardHeader>
            <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <i class="bi bi-calendar-check text-white text-3xl"></i>
            </div>
            <CardTitle class="text-xl">Agenda y Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-base">
              Sistema integrado de agendamiento con recordatorios automáticos y gestión de disponibilidad médica.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>

  <!-- Benefits Section -->
  <section class="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Beneficios del Sistema</h2>
        <div class="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
      </div>

      <div class="space-y-6">
        <!-- Benefit 1 -->
        <Card class="hover:shadow-lg transition-all duration-300">
          <CardContent class="p-6 flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="bi bi-lightning-charge text-white text-2xl"></i>
            </div>
            <div>
              <h4 class="text-xl font-semibold mb-2 text-gray-900">Optimización del Tiempo Médico</h4>
              <p class="text-gray-600">Reduce el tiempo de registro y consulta de información, permitiendo a los dermatólogos enfocarse más en la atención al paciente.</p>
            </div>
          </CardContent>
        </Card>

        <!-- Benefit 2 -->
        <Card class="hover:shadow-lg transition-all duration-300">
          <CardContent class="p-6 flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="bi bi-exclamation-triangle text-white text-2xl"></i>
            </div>
            <div>
              <h4 class="text-xl font-semibold mb-2 text-gray-900">Detección Temprana de Riesgos</h4>
              <p class="text-gray-600">El sistema de IA identifica patrones y señales de alerta que podrían indicar condiciones que requieren atención inmediata.</p>
            </div>
          </CardContent>
        </Card>

        <!-- Benefit 3 -->
        <Card class="hover:shadow-lg transition-all duration-300">
          <CardContent class="p-6 flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="bi bi-database text-white text-2xl"></i>
            </div>
            <div>
              <h4 class="text-xl font-semibold mb-2 text-gray-900">Centralización de Información</h4>
              <p class="text-gray-600">Toda la información médica accesible desde un solo lugar, eliminando duplicidades y mejorando la coordinación del cuidado.</p>
            </div>
          </CardContent>
        </Card>

        <!-- Benefit 4 -->
        <Card class="hover:shadow-lg transition-all duration-300">
          <CardContent class="p-6 flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="bi bi-bar-chart text-white text-2xl"></i>
            </div>
            <div>
              <h4 class="text-xl font-semibold mb-2 text-gray-900">Reportes y Estadísticas</h4>
              <p class="text-gray-600">Genera reportes automáticos con estadísticas de pacientes, tratamientos y resultados para toma de decisiones informadas.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>

  <!-- Chatbot Section -->
  <section class="py-20 px-4 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Asistente Virtual con IA</h2>
        <div class="w-20 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full"></div>
      </div>

      <Card class="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
        <CardContent class="p-10">
          <div class="text-center mb-8">
            <div class="flex items-center justify-center gap-3 mb-4">
              <i class="bi bi-robot text-5xl"></i>
              <h3 class="text-3xl font-bold">Chatbot Inteligente</h3>
            </div>
            <p class="text-xl text-purple-100">Nuestro asistente virtual con IA está disponible 24/7 para apoyar en la gestión clínica</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <!-- Chat Feature 1 -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-clipboard-check text-2xl"></i>
                <strong class="text-lg">Consulta de Historias</strong>
              </div>
              <p class="text-sm text-purple-100">Accede rápidamente a información de pacientes mediante consultas en lenguaje natural</p>
            </div>

            <!-- Chat Feature 2 -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-search text-2xl"></i>
                <strong class="text-lg">Análisis de Síntomas</strong>
              </div>
              <p class="text-sm text-purple-100">Obtén sugerencias de diagnóstico basadas en síntomas y patrones clínicos</p>
            </div>

            <!-- Chat Feature 3 -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-capsule text-2xl"></i>
                <strong class="text-lg">Recomendaciones</strong>
              </div>
              <p class="text-sm text-purple-100">Recibe sugerencias de tratamientos y protocolos clínicos actualizados</p>
            </div>

            <!-- Chat Feature 4 -->
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div class="flex items-center gap-2 mb-2">
                <i class="bi bi-graph-up text-2xl"></i>
                <strong class="text-lg">Estadísticas Rápidas</strong>
              </div>
              <p class="text-sm text-purple-100">Consulta métricas y tendencias de tu práctica clínica al instante</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div>
          <h3 class="text-5xl font-bold text-purple-400 mb-2">95%</h3>
          <p class="text-lg text-gray-300">Precisión en detección de patrones</p>
        </div>
        <div>
          <h3 class="text-5xl font-bold text-purple-400 mb-2">60%</h3>
          <p class="text-lg text-gray-300">Reducción en tiempo de registro</p>
        </div>
        <div>
          <h3 class="text-5xl font-bold text-purple-400 mb-2">100%</h3>
          <p class="text-lg text-gray-300">Seguridad de datos médicos</p>
        </div>
        <div>
          <h3 class="text-5xl font-bold text-purple-400 mb-2">24/7</h3>
          <p class="text-lg text-gray-300">Disponibilidad del sistema</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white text-center py-8 px-4">
    <p class="text-gray-400">&copy; 2025 DermaIA - Sistema de Gestión Dermatológica con IA. Todos los derechos reservados.</p>
  </footer>
</div>