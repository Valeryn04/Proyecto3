// ============================================
// Servicio para gestión de roles y permisos
// ============================================

const API_URL = import.meta.env.VITE_API_URL || "https://fastapi-4-aqig.onrender.com/api";

// =======================
// Tipos de datos
// =======================

export interface Funcionalidad {
  id_modulo_permiso: number;
  nombre_funcionalidad: string;
  permiso: string;
  asignada?: boolean; // ✅ Nuevo campo opcional
}

export interface Permiso {
  id_permiso: number;
  nombre_permiso: string;
  seleccionado?: boolean;
  asignada?: boolean; // ✅ AGREGA ESTA LÍNEA
}

export interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
  seleccionado?: boolean; // asegúrate que sea opcional también
  permisos: Permiso[];
  funcionalidades: Funcionalidad[];
}

export interface ModuloPermisoData {
  id_modulo: number;
  permisos: number[];
}

export interface CrearRolData {
  nombre_rol: string;
  descripcion?: string;
  modulos_permisos: ModuloPermisoData[];
}

export interface CrearRolResponse {
  resultado: string;
  id_rol: number;
}

export interface ModuloPermisoSeleccionado {
  id_modulo: number;
  permisos: number[];
}

export interface RolEditar {
  nombre_rol: string;
  descripcion: string;
  modulos_permisos: ModuloPermisoSeleccionado[];
}


/**
 * 🔹 Obtiene la lista de módulos y permisos agrupados
 */
export async function obtenerModulosYPermisos(): Promise<Modulo[]> {
  try {
    const response = await fetch(`${API_URL}/roles/roles/modulos-permisos/all`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener módulos y permisos`);
    }

    const data = await response.json();
    return data.resultado || [];
  } catch (error) {
    console.error("❌ Error en obtenerModulosYPermisos:", error);
    throw error;
  }
}


/**
 * 🔹 Crea un nuevo rol con sus módulos y permisos asociados
 */
export async function crearRolConModulosPermisos(
  data: CrearRolData
): Promise<CrearRolResponse> {
  try {
    const response = await fetch(`${API_URL}/roles/crear-con-permisos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Error ${response.status} al crear el rol.`
      );
    }

    const result = await response.json();
    console.log("✅ Rol creado correctamente:", result);
    window.location.reload(); 
    return result;
  } catch (error: any) {
    console.error("❌ Error en crearRolConModulosPermisos:", error.message || error);
    throw error;
  }
}

/**
 * (Opcional) Obtiene todos los roles registrados.
 * @returns Lista de roles disponibles.
 */
export async function obtenerRoles(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/roles/roles`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Error al obtener roles");

    const roles = await response.json();
    console.log("📋 Roles cargados:", roles);
    return roles;
  } catch (error: any) {
    console.error("❌ Error en obtenerRoles:", error.message || error);
    return [];
  }
}


// 🔹 Obtener módulos y permisos de un rol específico
export async function obtenerModulosPorRol(idRol: number): Promise<Modulo[]> {
  const res = await fetch(`${API_URL}/rol-permisos/modulos-usuario/${idRol}`);
  if (!res.ok) throw new Error("Error al obtener módulos del rol");
  const data = await res.json();
  return data.resultado || []; // ✅ importante
}


// 🔹 Actualizar un rol existente con permisos
export async function actualizarRol(idRol: number, data: RolEditar): Promise<any> {
  const res = await fetch(`${API_URL}/roles/editar-con-permisos/${idRol}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  window.location.reload(); 

 if (!res.ok) {
    throw new Error("Error al actualizar el rol");
  }

 const resultado = await res.json();
  window.location.reload(); // ✅ se ejecuta solo si todo salió bien
  return resultado;
}