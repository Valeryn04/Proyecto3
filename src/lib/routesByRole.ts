// src/lib/routesByRole.ts
export const allowedRoutes: Record<number, string[]> = {
  1: ["/admin", "/admin/usuarios", "/admin/permisos", "admin/perfil"], // rol 1 = admin
  2: ["/admin", "/admin/usuarios", "/admin/permisos", "admin/perfil"], // rol 1 = admin
  3: ["/medico"],                     // rol 2 = user
};
