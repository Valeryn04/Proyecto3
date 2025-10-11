import { get } from "svelte/store";
import { session } from "$lib/stores/session";

const API_URL = import.meta.env.VITE_API_URL;

// ==========================================
// UTILIDADES
// ==========================================

/**
 * Obtiene el token de la sesión actual
 */
function getToken(): string {
  const currentSession = get(session);
  const token = currentSession?.token;

  if (!token) {
    throw new Error("Sin token en sesión");
  }

  return token;
}

/**
 * Decodifica el JWT y obtiene el user_id
 */
export function getUserIdFromToken(): string | null {
  try {
    const token = getToken();
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Prioridad: sub > user_id > id_usuario
    return payload.sub || payload.user_id || payload.id_usuario;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
}

/**
 * Decodifica el JWT y obtiene el rol del usuario
 */
export function getRolFromToken(): number | null {
  try {
    const token = getToken();
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.rol || null;
  } catch (error) {
    console.error("Error al obtener rol del token:", error);
    return null;
  }
}

// ==========================================
// USUARIOS
// ==========================================

/**
 * Obtiene todos los usuarios
 */
export async function fetchUsuarios() {
  const token = getToken();

  const response = await fetch(`${API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener usuarios (${response.status})`);
  }

  const data = await response.json();
  return data.resultado;
}

/**
 * Obtiene un usuario por ID
 */
export async function fetchUserById(userId: string | number) {
  const token = getToken();

  const response = await fetch(`${API_URL}/usuarios/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("fetchUserById error:", response.status, errorText);
    throw new Error(`Error al obtener usuario: ${response.status}`);
  }

  return await response.json();
}

/**
 * Crea un usuario SIN atributos
 */
export async function crearUsuario(usuarioData: any) {
  const token = getToken();

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
  };

  console.log("📤 Enviando usuario al backend:", payload);

  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error al crear usuario:", response.status, errorText);
    throw new Error(errorText || `Error al crear usuario (${response.status})`);
  }

  const resultado = await response.json();
  console.log("✅ Usuario creado:", resultado);
  return resultado;
}

/**
 * Crea un usuario CON atributos
 */
export async function crearUsuarioConAtributos(usuarioData: any) {
  const token = getToken();

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
    atributos: usuarioData.atributos,
  };

  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error al crear usuario:", response.status, errorText);
    throw new Error(errorText || `Error al crear usuario (${response.status})`);
  }

  const resultado = await response.json();
  console.log("✅ Usuario creado con atributos:", resultado);
  return resultado;
}

/**
 * Actualiza un usuario
 */
export async function actualizarUsuario(id: number, usuarioData: any) {
  const token = get(session)?.token;
  if (!token) throw new Error("Sin token en sesión");

  console.log("📤 Actualizando usuario:", id, usuarioData);

  // 🔧 Limpia y normaliza el payload antes de enviarlo
  const payload: any = {
    nombre: usuarioData.nombre?.trim(),
    apellido: usuarioData.apellido?.trim(),
    tipo_documento: usuarioData.tipo_documento,
    numero_documento: usuarioData.numero_documento,
    telefono: usuarioData.telefono,
    direccion: usuarioData.direccion,
    email: usuarioData.email,
    fecha_nacimiento: usuarioData.fecha_nacimiento,
    sexo: usuarioData.sexo,
    contrasena: usuarioData.contrasena || undefined,
    id_rol: usuarioData.id_rol ? Number(usuarioData.id_rol) : undefined,
    estado: usuarioData.estado ?? true,
    atributos: Array.isArray(usuarioData.atributos)
      ? usuarioData.atributos
          // 🔹 Solo enviamos los atributos que tengan id y valor definidos
          .filter(
            (attr: any) =>
              attr &&
              typeof attr.id_atributo === "number" &&
              attr.valor !== undefined &&
              attr.valor !== null
          )
          .map((attr: any) => ({
            id_atributo: attr.id_atributo,
            valor: String(attr.valor).trim(),
          }))
      : [],
  };

  // ✅ Si no hay atributos, enviamos lista vacía (así el backend sabrá eliminar todos)
  if (!payload.atributos || payload.atributos.length === 0) {
    payload.atributos = [];
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Error al actualizar usuario:", response.status, errorData);
      throw new Error(
        errorData.detail || `Error al actualizar usuario (${response.status})`
      );
    }

    const resultado = await response.json();
    console.log("✅ Usuario actualizado correctamente:", resultado);
    return resultado;
  } catch (error: any) {
    console.error("❌ Error en actualizarUsuario:", error);
    throw new Error(error.message || "Error desconocido al actualizar usuario");
  }
}

/**
 * Cambia el estado de un usuario (activar/desactivar)
 */
export async function cambiarEstadoUsuario(
  usuarioId: number,
  nuevoEstado: boolean
) {
  const token = getToken();

  const response = await fetch(`${API_URL}/usuarios/${usuarioId}/estado`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("cambiarEstadoUsuario error:", response.status, errorText);
    throw new Error("Error al cambiar estado del usuario");
  }

  return await response.json();
}

// ==========================================
// PERFIL COMPLETO
// ==========================================

/**
 * Obtiene el perfil completo del usuario logueado
 */
export async function fetchMiPerfil() {
  const userId = getUserIdFromToken();

  if (!userId) {
    throw new Error("No se pudo obtener el ID del usuario del token");
  }

  return await fetchPerfilCompleto(userId);
}

/**
 * Obtiene el perfil completo de un usuario específico
 * Incluye: datos del usuario, rol e información de atributos
 */
export async function fetchPerfilCompleto(userId: string | number) {
  const token = getToken();

  try {
    // 1. Obtener datos del usuario
    const responseUsuario = await fetch(`${API_URL}/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!responseUsuario.ok) {
      const errorText = await responseUsuario.text();
      console.error(
        "Error al obtener usuario:",
        responseUsuario.status,
        errorText
      );
      throw new Error(`Error al obtener usuario: ${responseUsuario.status}`);
    }

    const usuario = await responseUsuario.json();

    // 2. Obtener atributos del usuario
    let atributos = [];
    try {
      const responseAtributos = await fetch(
        `${API_URL}/usuarios/${userId}/atributos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (responseAtributos.ok) {
        const dataAtributos = await responseAtributos.json();
        atributos = dataAtributos.resultado || [];
      } else {
        console.warn("No se pudieron cargar los atributos del usuario");
      }
    } catch (error) {
      console.warn("Error al cargar atributos:", error);
    }

    // 3. Obtener información del rol
    let rolInfo = null;
    if (usuario.id_rol) {
      try {
        const responseRol = await fetch(`${API_URL}/roles/${usuario.id_rol}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (responseRol.ok) {
          rolInfo = await responseRol.json();
        } else {
          console.warn("No se pudo cargar información del rol");
        }
      } catch (error) {
        console.warn("Error al cargar rol:", error);
      }
    }

    // 4. Retornar perfil completo estructurado
    return {
      usuario: {
        id_usuario: usuario.id_usuario,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        tipo_documento: usuario.tipo_documento,
        numero_documento: usuario.numero_documento,
        fecha_nacimiento: usuario.fecha_nacimiento,
        sexo: usuario.sexo,
        telefono: usuario.telefono,
        email: usuario.email,
        direccion: usuario.direccion,
        estado: usuario.estado,
        id_rol: usuario.id_rol,
        create_date: usuario.create_date,
        update_date: usuario.update_date,
      },
      rol: rolInfo
        ? {
            id_rol: rolInfo.id_rol,
            nombre_rol: rolInfo.nombre_rol || rolInfo.nombre,
            descripcion_rol: rolInfo.descripcion,
          }
        : null,
      atributos: atributos,
    };
  } catch (error) {
    console.error("Error en fetchPerfilCompleto:", error);
    throw error;
  }
}

// ==========================================
// ROLES
// ==========================================

/**
 * Obtiene todos los roles
 */
export async function fetchRoles() {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles`, {
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
  return data.resultado || data;
}

/**
 * Obtiene un rol por ID
 */
export async function fetchRolById(idRol: number) {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles/${idRol}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error al obtener rol:", errorText);
    throw new Error(`Error al obtener rol (${response.status})`);
  }

  return await response.json();
}

/**
 * Crea un nuevo rol
 */
export async function crearRol(nombre_rol: string) {
  const token = getToken();

  const response = await fetch(`${API_URL}/roles`, {
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
}

// ==========================================
// ATRIBUTOS
// ==========================================

/**
 * Obtiene todos los atributos disponibles
 */
export async function fetchAtributos() {
  const token = getToken();

  const response = await fetch(`${API_URL}/atributos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener atributos (${response.status})`);
  }

  const data = await response.json();
  return data.resultado;
}

/**
 * Obtiene los atributos de un usuario específico
 */
export async function fetchAtributosUsuario(userId: string | number) {
  const token = getToken();

  const response = await fetch(`${API_URL}/usuarios/${userId}/atributos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error al obtener atributos del usuario (${response.status})`
    );
  }

  const data = await response.json();
  return data.resultado || [];
}

/**
 * Actualiza un atributo de usuario específico
 */
export async function actualizarAtributoUsuario(
  idUsuarioAtributo: number,
  nuevoValor: string
) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/usuario-atributos/${idUsuarioAtributo}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ valor: nuevoValor }),
    }
  );

  if (!response.ok) {
    throw new Error(`Error al actualizar atributo (${response.status})`);
  }

  return await response.json();
}

/**
 * Elimina un atributo de usuario
 */
export async function eliminarAtributoUsuario(idUsuarioAtributo: number) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/usuario-atributos/${idUsuarioAtributo}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error al eliminar atributo (${response.status})`);
  }

  return await response.json();
}
