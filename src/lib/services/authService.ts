import { authStore } from "$lib/stores/auth";

export async function login(email: string, password: string) {
  // Validaciones básicas de correo y contraseña
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("❌ Correo inválido");
    return false;
  }

  if (!password || password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    console.error("❌ Contraseña inválida");
    return false;
  }

  // 🔹 Simulación de usuarios permitidos
  if (email === "admin@clinica.com" && password === "Admin@1234") {
    const fakeToken = "fake-jwt-admin-123456";
    authStore.set({
      token: fakeToken,
      isAuthenticated: true,
      role: "admin",
    });
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("role", "admin");
    console.log("✅ Sesión iniciada como ADMIN");
    return true;
  }

  if (email === "medico@clinica.com" && password === "Medico@1234") {
    const fakeToken = "fake-jwt-medico-123456";
    authStore.set({
      token: fakeToken,
      isAuthenticated: true,
      role: "medico",
    });
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("role", "medico");
    console.log("✅ Sesión iniciada como MÉDICO");
    return true;
  }

  console.error("❌ Credenciales incorrectas");
  return false;
}

export function logout() {
  authStore.set({
    token: null,
    isAuthenticated: false,
    role: null,
  });
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}
