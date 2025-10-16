import { writable, derived, get } from 'svelte/store';

// ==========================================
// TIPOS
// ==========================================
interface Funcionalidad {
    id_modulo_permiso: number;
    nombre_funcionalidad: string;
    permiso: string; // Ejemplo: 'crear', 'actualizar', 'consultar'
}

export interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
  icono: string;
  url: string;
  funcionalidades: Funcionalidad[];
}

// ==========================================
// STORE PRINCIPAL
// ==========================================

/**
 * Store principal que contiene todos los módulos y sus funcionalidades 
 * a los que el rol actual tiene acceso. Se actualiza al inicio de sesión.
 */
export const modulosStore = writable<Modulo[]>([]);

// ==========================================
// DERIVED STORES (Lectura eficiente de permisos)
// ==========================================

/**
 * Store derivado que extrae solo los nombres de permisos únicos
 * a nivel global. Útil para checks generales o para depuración.
 * Ejemplo: ["crear", "leer", "actualizar", "eliminar"]
 */
export const permisos = derived(modulosStore, ($modulos) => {
  const permisosUnicos = new Set<string>();

  $modulos.forEach(modulo => {
    modulo.funcionalidades.forEach(func => {
      permisosUnicos.add(func.permiso);
    });
  });

  return Array.from(permisosUnicos);
});

/**
 * Store derivado con permisos agrupados por módulo.
 * Ejemplo: { "Usuarios": ["crear", "leer"], "Citas": ["crear"] }
 */
export const permisosPorModulo = derived(modulosStore, ($modulos) => {
  const mapa: Record<string, string[]> = {};

  $modulos.forEach(modulo => {
    // Mapea solo los nombres de permiso para ese módulo
    mapa[modulo.nombre_modulo] = modulo.funcionalidades.map(f => f.permiso);
  });

  return mapa;
});

// ==========================================
// FUNCIONES DE UTILIDAD (Uso en componentes)
// ==========================================

/**
 * Verifica si el usuario tiene un permiso específico en un módulo.
 * Es la función recomendada para habilitar/deshabilitar botones y acciones.
 * @param nombreModulo - Nombre del módulo (ej: "Usuarios", "Citas")
 * @param permiso - Nombre del permiso (ej: "crear", "actualizar", "eliminar")
 * @returns true si tiene el permiso, false si no
 */
export function tieneFuncionalidad(nombreModulo: string, permiso: string): boolean {
    console.log(nombreModulo, permiso )
  // Usamos get() para obtener el valor actual del store sin suscribir el componente
  const modulos = get(modulosStore); 
  console.log("modulos", modulos)
  
  // 1. Busca el módulo (ignorando mayúsculas/minúsculas)
  const modulo = modulos.find(m => m.nombre_modulo.toLowerCase() === nombreModulo.toLowerCase());
  console.log("modulo", modulo?.funcionalidades)

  if (modulo) {
    // 2. Busca el permiso dentro de las funcionalidades del módulo (ignorando mayúsculas/minúsculas)
    return modulo.funcionalidades.some(f => f.permiso.toLowerCase() === permiso.toLowerCase())
  }

  return false;
}

/**
 * Verifica si el usuario tiene acceso a un módulo específico (si aparece en el menú).
 * @param nombreModulo - Nombre del módulo
 * @returns true si tiene acceso al módulo (tiene alguna funcionalidad asignada)
 */
export function tieneAccesoModulo(nombreModulo: string): boolean {
  // Usamos get() para obtener el valor actual del store
  const modulos = get(modulosStore); 
  // Basta con que el módulo exista en la lista cargada
  return modulos.some(m => m.nombre_modulo.toLowerCase() === nombreModulo.toLowerCase());
}

/**
 * Obtiene todas las funcionalidades de un módulo específico.
 * @param nombreModulo - Nombre del módulo
 * @returns Array de funcionalidades o array vacío
 */
export function getFuncionalidadesModulo(nombreModulo: string): Funcionalidad[] {
  // Usamos get() para obtener el valor actual del store
  const modulos = get(modulosStore); 
  const modulo = modulos.find(m => m.nombre_modulo.toLowerCase() === nombreModulo.toLowerCase());
  return modulo?.funcionalidades || [];
}

// ==========================================
// GESTIÓN DE CARGA
// ==========================================

/**
 * Carga los módulos y permisos del usuario desde el backend.
 * Nota: Es vital que la variable de entorno VITE_API_URL esté definida en Svelte.
 * @param idRol - ID del rol del usuario
 */
export async function cargarPermisos(idRol: number): Promise<void> {
  // Usamos import.meta.env para acceder a las variables de entorno de Vite/SvelteKit
  const API_URL = import.meta.env.VITE_API_URL;
  
  try {
    const response = await fetch(`${API_URL}/rol-permisos/modulos-usuario/${idRol}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status} al cargar permisos.`);
    }

    const data = await response.json();

    if (data && data.resultado) {
      modulosStore.set(data.resultado); // Actualiza el store principal
      console.log('✅ Permisos cargados:', data.resultado);
    } else {
      // Manejar caso donde la respuesta es OK pero no trae datos de permisos
      console.warn('⚠️ La carga de permisos fue exitosa, pero no se encontraron resultados para el rol.');
      modulosStore.set([]); 
    }
  } catch (error) {
    console.error('❌ Error fatal al cargar permisos:', error);
    modulosStore.set([]); // Si hay error, vacía el store
  }
}

/**
 * Limpia el store de módulos (útil al hacer logout).
 */
export function limpiarPermisos(): void {
  modulosStore.set([]);
}
