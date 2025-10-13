// ============================================
// Servicio para gestión de roles y permisos
// ============================================

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// =======================
// Tipos de datos
// =======================

export interface Permiso {
  id_permiso: number;
  nombre_permiso: string;
  seleccionado: boolean;
}

export interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
  seleccionado: boolean;
  permisos: Permiso[];
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


// =======================
// Funciones principales
// =======================

/**
 * Obtiene la lista de módulos y permisos disponibles.
 */
export async function obtenerModulosYPermisos(): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/modulos-permisos/`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener módulos y permisos`);
    }

    const data = await response.json();
    console.log("✅ Módulos y permisos obtenidos:", data);
    return data;
  } catch (error) {
    console.error("❌ Error en obtenerModulosYPermisos:", error);
    throw error;
  }
}

/**
 * Crea un nuevo rol con sus módulos y permisos asociados.
 */
export async function crearRolConModulosPermisos(
  data: CrearRolData
): Promise<CrearRolResponse> {
  try {
    const response = await fetch(`${API_URL}/roles/crear-con-permisos`, {  // Aquí se corrige la URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status} al crear el rol.`);
    }

    const result: CrearRolResponse = await response.json();
    console.log("✅ Rol creado:", result);
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
