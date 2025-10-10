import { writable } from "svelte/store";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { goto } from "$app/navigation";

interface TokenPayload {
  sub: string;
  rol: number;
  exp: number;
}

interface SessionState {
  token: string | null;
  payload: TokenPayload | null;
  loggedIn: boolean;
}

const INACTIVITY_LIMIT = 30 * 60 * 1000;
let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

function createSession() {
  const { subscribe, set } = writable<SessionState>({
    token: null,
    payload: null,
    loggedIn: false,
  });

  function decodeToken(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error("Error decodificando token:", error);
      return null;
    }
  }

  function startInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      Swal.fire({
        title: "Sesión cerrada",
        text: "Sesión cerrada por inactividad",
        icon: "warning",
        confirmButtonColor: "#a9887f",
      }).then(() => {
        session.logout();
        goto("/");
      });
    }, INACTIVITY_LIMIT);
  }

  function resetInactivityTimer() {
    if (typeof window !== undefined) {
      document.removeEventListener("mousemove", startInactivityTimer);
      document.removeEventListener("keydown", startInactivityTimer);
      document.removeEventListener("click", startInactivityTimer);

      document.addEventListener("mousemove", startInactivityTimer);
      document.addEventListener("keydown", startInactivityTimer);
      document.addEventListener("click", startInactivityTimer);

      startInactivityTimer();
    }
  }

  return {
    subscribe,

    login(token: string) {
      const payload = decodeToken(token);
      if (!payload) throw new Error("Token inválido");

      if (typeof window !== "undefined") {
        sessionStorage.setItem("token", token);
      }
      set({ token, payload, loggedIn: true });

      resetInactivityTimer();
    },

    logout() {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
      }
      set({ token: null, payload: null, loggedIn: false });

      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = null;

      if (typeof window !== "undefined") {
        document.removeEventListener("mousemove", startInactivityTimer);
        document.removeEventListener("keydown", startInactivityTimer);
        document.removeEventListener("click", startInactivityTimer);
      }
    },

    init() {
      if (typeof window === "undefined") {
        return;
      }
      const token = sessionStorage.getItem("token");
      if (token) {
        const payload = decodeToken(token);

        if (payload && payload.exp * 1000 > Date.now()) {
          set({ token, payload, loggedIn: true });
          resetInactivityTimer();
        } else {
          sessionStorage.removeItem("token");
          set({ token: null, payload: null, loggedIn: false });
        }
      }
    },
  };
}

console.log("API_URL:", import.meta.env.VITE_API_URL);

export const session = createSession();
