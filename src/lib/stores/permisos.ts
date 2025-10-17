import { writable, derived, get } from 'svelte/store';

// ==========================================
// TIPOS que coinciden con la respuesta del backend
// ==========================================
export interface Funcionalidad {
    id_modulo_permiso: number;
    nombre_funcionalidad: string;
    permiso: string; // Ejemplo: 'crear', 'actualizar', 'consultar'
}

export interface Modulo {
    id_modulo: number;
    nombre_modulo: string; // Ejemplo: 'Usuarios'
    icono: string;
    url: string;
    funcionalidades: Funcionalidad[];
}

// ==========================================
// STORE PRINCIPAL (Fuente de verdad: array de módulos)
// ==========================================

/**
 * Store principal que contiene todos los módulos y sus funcionalidades 
 * a los que el rol actual tiene acceso (el array 'resultado' de la API).
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
            permisosUnicos.add(func.permiso.toLowerCase()); // Normalizamos
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
        // Mapea el nombre del módulo y solo los permisos en minúsculas
        mapa[modulo.nombre_modulo] = modulo.funcionalidades.map(f => f.permiso.toLowerCase());
    });

    return mapa;
});

// ==========================================
// FUNCIONES DE UTILIDAD (Uso en componentes)
// ==========================================

/**
 * Verifica si el usuario tiene un permiso específico en un módulo.
 * Es la función recomendada para habilitar/deshabilitar botones y acciones.
 * CORRECCIÓN: Usa get() en lugar de subscribe() para eficiencia.
 * @param nombreModulo - Nombre del módulo (ej: "Usuarios", "Citas")
 * @param permiso - Nombre del permiso (ej: "crear", "actualizar", "eliminar")
 * @returns true si tiene el permiso, false si no
 */
export function tieneFuncionalidad(nombreModulo: string, permiso: string): boolean {
    // ⭐️ Usamos get() para obtener el valor actual sin suscribir el componente
    const modulos = get(modulosStore);
    
    // 1. Busca el módulo (ignorando mayúsculas/minúsculas)
    const modulo = modulos.find(m => m.nombre_modulo.toLowerCase() === nombreModulo.toLowerCase());

    if (modulo) {
        // 2. Busca el permiso dentro de las funcionalidades del módulo (ignorando mayúsculas/minúsculas)
        return modulo.funcionalidades.some(f => f.permiso.toLowerCase() === permiso.toLowerCase());
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
// GESTIÓN DE CARGA (Usado en Layout o Login)
// ==========================================

/**
 * Carga los módulos y permisos del usuario desde el backend.
 * @param idRol - ID del rol del usuario
 */
export async function cargarPermisos(idRol: number): Promise<void> {
    const API_URL = import.meta.env.VITE_API_URL || 'https://fastapi-4-aqig.onrender.com/api'; // Aseguramos un fallback
    
    try {
        // Llama a la API con el ID del rol
        const response = await fetch(`${API_URL}/rol-permisos/modulos-usuario/${idRol}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status} al cargar permisos.`);
        }

        const data = await response.json();

        if (data && data.resultado) {
            // Actualiza el store principal con el array 'resultado' del backend
            modulosStore.set(data.resultado); 
            console.log('✅ Permisos cargados desde API:', data.resultado);
        } else {
            console.warn('⚠️ La carga de permisos fue exitosa, pero no se encontraron resultados.');
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
