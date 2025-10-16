export const allowedRoutes: Record<number, string[]> = {
    // Rol 1: Administrador - Acceso total al panel de administración
    1: ["/admin", "/admin/usuarios", "/admin/permisos", "/admin/perfil", "/admin/modulos", "/admin/reportes"],

    // Rol 2: Asistente - Acceso total al panel de administración (igual que admin en este ejemplo)
    2: ["/admin", "/admin/usuarios", "/admin/permisos", "/admin/perfil", "/admin/modulos"],

    // Rol 3: Médico - Acceso solo a la ruta /medico
    3: ["/medico"],

    // Rol 4: Paciente - Acceso solo a la ruta /paciente
    4: ["/paciente"],
};