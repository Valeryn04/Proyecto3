<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { session } from "$lib/stores/session";
    import { get } from "svelte/store";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import { login } from "$lib/services/authService";

    let usuario = "";
    let password = "";
    let loading = false;

    let errors = { usuario: "", password: "" };
    let touched = { usuario: false, password: false };

    interface TokenPayload {
        sub: string;
        rol: number;
        exp: number;
    }

    function validateUsuario(value: string) {
        if (!value) return "El usuario es obligatorio.";
        return "";
    }

    /**
     * @description Validación de contraseña: Mínimo 8 caracteres.
     * La validación de símbolos se ha eliminado para una UX más suave en el login.
     */
    function validatePassword(value: string) {
        if (!value) return "La contraseña es obligatoria.";
        if (value.length < 8) return "Debe tener al menos 8 caracteres.";
        // if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) 
        //  return "Debe contener al menos un símbolo."; // <-- Eliminado
        return "";
    }

    function handleInput(field: "usuario" | "password") {
        if (!touched[field]) touched[field] = true;
        if (field === "usuario") errors.usuario = validateUsuario(usuario);
        if (field === "password") errors.password = validatePassword(password);
    }

    async function handleSubmit() {
        touched = { usuario: true, password: true };
        errors.usuario = validateUsuario(usuario);
        errors.password = validatePassword(password);

        if (errors.usuario || errors.password) {
            Swal.fire("Error", "Por favor corrige los errores", "error");
            return;
        }

        try {
            loading = true;
            const data = await login(usuario, password);

            session.login(data.access_token);

            Swal.fire({
                title: "¡Bienvenido!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            const { payload } = get(session);

            setTimeout(() => {
                if (!payload) {
                    Swal.fire("Error", "Token inválido", "error");
                    return;
                }
                
                // Redirección de roles agrupada y simplificada
                switch (payload.rol) {
                    case 1: // Administrador
                    case 2: // Asistente
                        goto("/admin");
                        break;
                    case 3: // Médico
                        goto("/medico");
                        break;
                    case 4: // Paciente
                        goto("/paciente");
                        break;
                    default:
                        Swal.fire("Acceso denegado", 
                        "Tu rol no tiene acceso todavía.", 
                        "warning");
                }
            }, 1500);

        } catch (err: any) {
            Swal.fire("Error", err.message || "Usuario o contraseña incorrectos", "error");
        } finally {
            loading = false;
        }
    }
</script>

<div
    class="min-h-screen flex items-center justify-center bg-[#f9f7f3] bg-gradient-to-b from-[#f3eee7] to-[#e7dfd5] font-[Poppins] px-4"
>
    <Card.Root
        class="!p-0 text-card-foreground flex flex-col md:flex-row w-full max-w-5xl min-h-[540px] md:min-h-[580px] shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-[#cac4a4]"
    >
        <div class="w-full md:w-1/2 flex flex-col justify-center px-10 py-8">
            <div class="mb-6">
                <h2
                    class="text-3xl font-extrabold text-[#1f1411] tracking-wide mb-1 leading-tight text-center"
                >
                    Iniciar sesión
                </h2>
                <br />
                <p class="text-black text-sm font-base leading-snug">
                    Ingresa tus credenciales para acceder al sistema clínico
                </p>
            </div>

            <form class="flex flex-col gap-5" on:submit|preventDefault={handleSubmit}>
                <div class="flex flex-col gap-1.5">
                    <Label for="usuario" class="text-black font-medium text-sm">
                        Usuario
                    </Label>
                    <input
                        id="usuario"
                        type="text"
                        bind:value={usuario}
                        placeholder="usuario123"
                        on:input={() => handleInput("usuario")}
                        on:focus={() => (touched.usuario = true)}
                        class="rounded-lg border font-light h-10 text-[#1f1411] px-3 focus:outline-none transition-all duration-200
                            {touched.usuario && errors.usuario
                            ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[#cac4a4] focus:border-[#a9887f] focus:ring-1 focus:ring-[#a9887f]/30'}"
                    />
                    {#if touched.usuario && errors.usuario}
                        <span class="text-xs text-red-500 mt-1">{errors.usuario}</span>
                    {/if}
                </div>

                <div class="flex flex-col gap-1.5">
                    <Label for="password" class="text-black font-medium text-sm">
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
                            {touched.password && errors.password
                            ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[#cac4a4] focus:border-[#a9887f] focus:ring-1 focus:ring-[#a9887f]/30'}"
                    />
                    {#if touched.password && errors.password}
                        <span class="text-xs text-red-500 mt-1">{errors.password}</span>
                    {/if}

                    <a
                        href="#"
                        class="text-m text-[#a9887f] hover:text-[#716557] transition-colors font-base text-right mt-1"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                <Button
                    type="submit"
                    class="w-full bg-[#a9887f] hover:bg-[#8d6c63] text-white font-bold py-2.5 rounded-lg shadow-md transition-all tracking-wide mt-2"
                    disabled={loading}
                >
                    {#if loading}
                       Cargando...
                    {:else}
                       Iniciar sesión
                    {/if}
                </Button>
            </form>

            <div class="text-center text-xs text-[#716557] mt-6 font-light">
                © 2025 <span class="text-[#a9887f] font-medium"
                    >Clínica Salud Vital</span
                >. Todos los derechos reservados.
            </div>
        </div>

        <div class="hidden md:block md:w-1/2 relative">
            <img
                src="/img/login.jpg"
                alt="Imagen clínica"
                class="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    </Card.Root>
</div>