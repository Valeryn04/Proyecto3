const rawUrl = import.meta.env.VITE_API_URL || "https://fastapi-4-aqig.onrender.com/api";
const API_URL = rawUrl.replace(/\/+$/, ""); // quita barras finales duplicadas

/**
 * Realiza la autenticación del usuario contra la API.
 * @param usuario Nombre de usuario o email.
 * @param contrasena Contraseña.
 * @returns Un objeto con el token si es exitoso.
 */
export async function login(usuario: string, contrasena: string): Promise<{ access_token: string }> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    });

    if (!response.ok) {
      let errorMsg = "";

      try {
        const errorData = await response.json();
        errorMsg =
          errorData.detail ||
          errorData.message ||
          `Error ${response.status}: ${response.statusText}`;
      } catch {
        const errorText = await response.text();
        errorMsg = errorText || `Error ${response.status}: ${response.statusText}`;
      }

      // Errores personalizados por status
      switch (response.status) {
        case 401:
          throw new Error("Contraseña incorrecta");
        case 403:
          throw new Error("Usuario inactivo");
        case 404:
          throw new Error("Usuario no encontrado");
        default:
          throw new Error(errorMsg);
      }
    }

    const data = await response.json();

    if (!data.access_token || typeof data.access_token !== "string") {
      throw new Error("El servidor no devolvió un token válido");
    }

    return { access_token: data.access_token };
  } catch (error: any) {
    console.error("❌ Error en authService:", error);
    throw new Error(error.message || "Error al iniciar sesión");
  }
}
