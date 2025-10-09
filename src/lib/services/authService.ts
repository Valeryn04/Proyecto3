const rawUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_URL = rawUrl.replace(/\/+$/, ""); // quita slashes al final

export async function login(usuario: string, contrasena: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en login: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en authService:", error);
    throw error;
  }
}
