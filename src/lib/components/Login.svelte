<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let email = "";
  let password = "";

  let errors = { email: "", password: "" };
  let touched = { email: false, password: false };

  // Funciones de validación
  function validateEmail(value: string) {
    if (!value) return "El correo electrónico es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Ingresa un correo electrónico válido.";
    return "";
  }

  function validatePassword(value: string) {
    if (!value) return "La contraseña es obligatoria.";
    if (value.length < 8) return "Debe tener al menos 8 caracteres.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      return "Debe contener al menos un símbolo.";
    return "";
  }

  // Validación dinámica
  function handleInput(field: "email" | "password") {
    if (!touched[field]) touched[field] = true; // Se activa al primer focus
    if (field === "email") errors.email = validateEmail(email);
    if (field === "password") errors.password = validatePassword(password);
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    touched = { email: true, password: true };
    errors.email = validateEmail(email);
    errors.password = validatePassword(password);

    if (!errors.email && !errors.password) {
      alert("Inicio de sesión exitoso 🎉");
    }
  }
</script>

<!-- Fondo -->
<div class="min-h-screen flex items-center justify-center bg-[#f9f7f3] bg-gradient-to-b from-[#f3eee7] to-[#e7dfd5] font-[Poppins] px-4">
  <Card.Root
    class="!p-0 text-card-foreground flex flex-col md:flex-row w-full max-w-5xl min-h-[540px] md:min-h-[580px] shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-[#cac4a4]"
  >
    <!-- Formulario -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-10 py-8">
      <div class="mb-6">
        <h2 class="text-3xl font-extrabold text-[#1f1411] tracking-wide mb-1 leading-tight text-center">
          Iniciar sesión
        </h2>
        <br>
        <p class="text-[#716557] text-sm font-light leading-snug">
          Ingresa tus credenciales para acceder al sistema clínico
        </p>
      </div>

      <form class="flex flex-col gap-5" on:submit={handleSubmit}>
        <!-- EMAIL -->
        <div class="flex flex-col gap-1.5">
          <Label for="email" class="text-[#413533] font-medium text-sm">
            Correo electrónico
          </Label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="ejemplo@clinica.com"
            on:input={() => handleInput("email")}
            on:focus={() => (touched.email = true)}
            class="rounded-lg border font-light h-10 text-[#1f1411] px-3 focus:outline-none transition-all duration-200
              {(touched.email && errors.email)
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-[#cac4a4] focus:border-[#a9887f] focus:ring-1 focus:ring-[#a9887f]/30'}"
          />
          {#if touched.email && errors.email}
            <span class="text-xs text-red-500 mt-1">{errors.email}</span>
          {/if}
        </div>

        <!-- PASSWORD -->
        <div class="flex flex-col gap-1.5">
          <Label for="password" class="text-[#413533] font-medium text-sm">
            Contraseña
          </Label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="••••••••"
            on:input={() => handleInput("password")}
            on:focus={() => (touched.password = true)}
            class="rounded-lg border font-light h-10 text-[#1f1411] px-3 focus:outline-none transition-all duration-200
              {(touched.password && errors.password)
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-[#cac4a4] focus:border-[#a9887f] focus:ring-1 focus:ring-[#a9887f]/30'}"
          />
          {#if touched.password && errors.password}
            <span class="text-xs text-red-500 mt-1">{errors.password}</span>
          {/if}

          <a href="#" class="text-xs text-[#a9887f] hover:text-[#716557] transition-colors font-medium text-right mt-1">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <!-- BOTÓN -->
        <Button
          type="submit"
          class="w-full bg-[#a9887f] hover:bg-[#8d6c63] text-white font-semibold py-2.5 rounded-lg shadow-md transition-all tracking-wide mt-2"
        >
          Iniciar sesión
        </Button>
      </form>

      <a href="/admin">Hola</a>

      <div class="text-center text-xs text-[#716557] mt-6 font-light">
        © 2025 <span class="text-[#a9887f] font-medium">Clínica Salud Vital</span>. Todos los derechos reservados.
      </div>
    </div>

    <!-- Imagen -->
    <div class="hidden md:block md:w-1/2 relative">
      <img
        src="/img/login.jpg"
        alt="Imagen clínica"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  </Card.Root>
</div>
