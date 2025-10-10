const rawUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_URL = rawUrl.replace(/\/+$/, "");

export async function login(usuario: string, contrasena: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    });

    if (!response.ok) {
      let errorMsg = "";

      try{
        const errorData = await response.json();
        errorMsg =
        errorData.detail ||
        errorData.message ||
        `Error ${response.status}: ${response.statusText}`;
      } catch {
        const errorText = await response.text();
        errorMsg = errorText ||  `Error ${response.status}: ${response.statusText}`;
      }

       // Mensajes personalizados
      if (response.status === 401) throw new Error("Contraseña incorrecta");
      if (response.status === 403) throw new Error("Usuario inactivo");
      if (response.status === 404) throw new Error("Usuario no encontrado");
      
      throw new Error(errorMsg);

    }

    const data = await response.json();

    if (!data.access_token) {
      throw new Error("El servidor no devolvio un token valido");
    }

    return data;
  } catch (error: any) {
    console.error("Error en authService:", error);
    throw new Error(error.message || "Error al iniciar sesión");
  }
}
