<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  // Datos del admin (puedes traerlos de tu API/store)
  let adminData = {
    nombre: "Valeryn",
    apellido: "Consuegra",
    email: "admin@clinica.com",
    rol: "Administrador",
    telefono: "+57 300 123 4567",
    departamento: "TI",
    fechaIngreso: "2023-01-15",
    avatar: "",
    Supervisor: "el chamo",
    nose: "Hola",
  };
</script>

<div class="max-w-5xl mx-auto">
  <div class="relative mb-8">
    <div
      class="h-25 bg-[#716557] rounded-t-2xl shadow-xl"
    ></div>

    <div
      class="relative px-8 pb-8 bg-white dark:bg-slate-900 rounded-b-2xl shadow-xl -mt-16"
    >
      <div
        class="flex flex-col md:flex-row items-center md:items-end gap-6 pt-20 md:pt-4"
      >
        <div class="relative -mt-24 md:-mt-16">
          <div
            class="p-1.5 bg-[#716557] rounded-full shadow-2xl"
          >
            <Avatar.Root
              class="h-32 w-32 border-4 border-white dark:border-slate-900"
            >
              <Avatar.Image src={adminData.avatar} alt={adminData.nombre} />
              <Avatar.Fallback
                class="text-3xl font-bold bg-[#716557] text-white"
              >
                {adminData.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
        </div>

        <div class="flex-1 text-center md:text-left">
          <h1
            class="text-4xl font-bold bg-black  bg-clip-text text-transparent mb-2"
          >
            {adminData.nombre}
            {adminData.apellido}
          </h1>
          <div
            class="flex flex-col md:flex-row items-center md:items-center gap-3 text-muted-foreground"
          >
            <span
              class="inline-flex items-center gap-2 px-3 py-1 bg-[#da8780]  text-white dark:text-white-300 rounded-full text-sm font-medium"
            >
                <i class="bi bi-person-fill w-4 h-5 text-white-600"></i>
              {adminData.rol}
            </span>
            <span class=" text-black font-base font-semibold"></span>
            <span class="flex items-center gap-2">
              <i class="bi bi-envelope-at-fill w-4 h-6 text-black"></i>
              {adminData.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs del perfil con diseño mejorado -->
  <Tabs.Root value="info" class="w-full">
    <Tabs.List
      class="grid w-full grid-cols-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-slate-700"
    >
      <Tabs.Trigger
        value="info"
        class="data-[state=active]:bg-[#716557] text-white font-bold rounded-lg transition-all duration-300 py-3 font-base text-xl"
      >
        <span class="flex items-center justify-center gap-1">
            <i class="bi bi-person w-5 h-5"></i>
          Información Personal
        </span>
      </Tabs.Trigger>
    </Tabs.List>

    <!-- Tab: Información Personal -->
    <Tabs.Content value="info" class="mt-6">
      <Card.Root
        class="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
      >
        <Card.Content class="pt-1">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2 group">
              <Label
                for="nombre"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
                <i class="bi bi-person-fill w-4 h-5 text-blue-600"></i>
                Nombre
              </Label>
              <Input
                id="nombre"
                bind:value={adminData.nombre}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div class="space-y-2 group">
              <Label
                for="apellido"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
                <i class="bi bi-person-fill w-4 h-5 text-blue-600"></i>
                Apellido
              </Label>
              <Input
                id="apellido"
                bind:value={adminData.apellido}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div class="space-y-2 group">
              <Label
                for="email"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
              <i class="bi bi-envelope-at-fill w-4 h-4 text-purple-500"></i>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                bind:value={adminData.email}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div class="space-y-2 group">
              <Label
                for="telefono"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
              <i class="bi bi-telephone-fill w-4 h-4 text-green-500"></i>
                Teléfono
              </Label>
              <Input
                id="telefono"
                bind:value={adminData.telefono}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div class="space-y-2 group">
              <Label
                for="departamento"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
              <i class="bi bi-building-fill w-4 h-4 text-orange-500"></i>
                Departamento
              </Label>
              <Input
                id="departamento"
                bind:value={adminData.departamento}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div class="space-y-2 group">
              <Label
                for="rol"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
              <i class="bi bi-check-circle-fill w-4 h-4 text-indigo-500"></i>
                Rol
              </Label>
              <Input
                id="rol"
                bind:value={adminData.rol}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div class="space-y-2 group">
              <Label
                for="fechaIngreso"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
              <i class="bi bi-calendar-check-fill w-4 h-4 text-pink-500"></i>
                Fecha de Ingreso
              </Label>
              <Input
                id="fechaIngreso"
                type="date"
                bind:value={adminData.fechaIngreso}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div class="space-y-2 group">
              <Label
                for="Supervisor"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
              <i class="bi bi-wrench w-4 h-4 text-blue-500"></i>
                Supervisor Directo
              </Label>
              <Input
                id="Supervisor"
                bind:value={adminData.Supervisor}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div class="space-y-2 group">
              <Label
                for="nose"
                class="text-sm font-bold text-black-700 dark:text-black-300 flex items-center gap-1"
              >
                <svg
                  class="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                No se
              </Label>
              <Input
                id="nose"
                bind:value={adminData.nose}
                disabled
                class="bg-gray-50 dark:bg-slate-800 border-gray-600 dark:border-slate-700 focus-visible:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</div>
