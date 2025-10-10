import { get } from "svelte/store";
import { session } from "$lib/stores/session";

// ✅ Ya existente: Obtener datos de un usuario por ID
export async function fetchUserById(userId: string) {
  const currentSession = get(session);
  const token = currentSession.token;

  if (!token) {
    throw new Error("Sin token en sesión");
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/usuarios/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fetchUserById → status:", response.status, "body:", errorText);
      throw new Error(`Error al obtener usuario: ${response.status}`);
    }

    const user = await response.json();

    return {
      name: user.nombre,
      email: user.correo
    };
  } catch (error) {
    console.error("Error en fetchUserById catch:", error);
    throw error;
  }
}

// 🆕 Obtener todos los usuarios
export async function fetchUsuarios() {
  const token = get(session)?.token;

  if (!token) throw new Error("Sin token en sesión");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Error al obtener usuarios (${response.status})`);
  }

  const data = await response.json();
  return data.resultado;
}


export async function crearUsuarioConAtributos(usuarioData: any) {
  const token = get(session)?.token;
  if (!token) throw new Error("Sin token en sesión");

  // Normaliza el payload al formato del backend
  const payload = {
    usuario: usuarioData.usuario?.trim(),
    contrasena: usuarioData.contrasena,
    nombre: usuarioData.nombre?.trim(),
    apellido: usuarioData.apellido?.trim(),
    tipo_documento: usuarioData.tipo_documento,
    numero_documento: usuarioData.numero_documento,
    telefono: usuarioData.telefono,
    direccion: usuarioData.direccion,
    email: usuarioData.email,
    fecha_nacimiento: usuarioData.fecha_nacimiento,
    sexo: usuarioData.sexo,
    id_rol: Number(usuarioData.id_rol),
    estado: usuarioData.estado ?? true,
    atributos: usuarioData.atributos, // Atributos asociados
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error al crear usuario:", response.status, errorText);
      throw new Error(errorText || `Error al crear usuario (${response.status})`);
    }

    const resultado = await response.json();
    console.log("✅ Usuario creado correctamente:", resultado);
    return resultado;
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : "Error desconocido al crear usuario";
    console.error("❌ crearUsuario:", mensaje);
    throw new Error(mensaje);
  }
}

// 🆕 Crear usuario
export async function crearUsuario(usuarioData: any) {
  const token = get(session)?.token;
  if (!token) throw new Error("Sin token en sesión");

  // 🔧 Normaliza el payload al formato del backend
  const payload = {
    usuario: usuarioData.usuario?.trim(),
    contrasena: usuarioData.contrasena,
    nombre: usuarioData.nombre?.trim(),
    apellido: usuarioData.apellido?.trim(),
    tipo_documento: usuarioData.tipo_documento,
    numero_documento: usuarioData.numero_documento,
    telefono: usuarioData.telefono,
    direccion: usuarioData.direccion,
    email: usuarioData.email,
    fecha_nacimiento: usuarioData.fecha_nacimiento,
    sexo: usuarioData.sexo,
    id_rol: Number(usuarioData.id_rol),
    estado: usuarioData.estado ?? true
  };

  console.log("📤 Enviando usuario al backend:", payload);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("📥 Respuesta del servidor:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error al crear usuario:", response.status, errorText);
      throw new Error(errorText || `Error al crear usuario (${response.status})`);
    }

    const resultado = await response.json();
    console.log("✅ Usuario creado correctamente:", resultado);
    return resultado;
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : "Error desconocido al crear usuario";
    console.error("❌ crearUsuario:", mensaje);
    throw new Error(mensaje);
  }
}

// 🆕 Actualizar usuario
export async function actualizarUsuario(id: number, usuarioData: any) {
  const token = get(session)?.token;

  if (!token) throw new Error("Sin token en sesión");

  console.log("📤 Actualizando usuario:", id, usuarioData);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuarioData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error al actualizar:", errorData);
      throw new Error(errorData.detail || "Error al actualizar usuario");
    }

    const resultado = await response.json();
    console.log("✅ Usuario actualizado:", resultado);
    return resultado;
  } catch (error) {
    console.error("❌ Error en actualizarUsuario:", error);
    throw error;
  }
}

// 🆕 Cambiar estado de usuario (activar/desactivar)
export async function cambiarEstadoUsuario(usuarioId: number, nuevoEstado: boolean) {
  const currentSession = get(session);
  const token = currentSession.token;

  if (!token) {
    throw new Error("Sin token en sesión");
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/usuarios/${usuarioId}/estado`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: nuevoEstado })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("cambiarEstadoUsuario → status:", response.status, "body:", errorText);
      throw new Error("Error al cambiar estado del usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en cambiarEstadoUsuario:", error);
    throw error;
  }
}

// ✅ Obtener todos los roles
export async function fetchRoles() {
  const token = get(session)?.token;
  if (!token) throw new Error("Sin token en sesión");

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error al obtener roles:", errorText);
      throw new Error(`Error al obtener roles (${response.status})`);
    }

    const data = await response.json();
    return data.resultado || data; // según estructura de tu backend
  } catch (error) {
    console.error("Error en fetchRoles:", error);
    throw error;
  }
}



// ✅ Crear un rol
export async function crearRol(nombre_rol: string) {
  const token = get(session)?.token;
  if (!token) throw new Error("Sin token en sesión");

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/roles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_rol }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error al crear rol:", errorText);
      throw new Error(`Error al crear rol (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en crearRol:", error);
    throw error;
  }
}

export async function fetchAtributos(): Promise<any> {
  const token = get(session)?.token;

  if (!token) throw new Error("Sin token en sesión");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/atributos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Error al obtener atributos (${response.status})`);
  }

  const data = await response.json();
  return data.resultado;
}


