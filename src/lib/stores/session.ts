import { writable } from "svelte/store";
import { jwtDecode } from "jwt-decode";

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

  return {
    subscribe,
    login(token: string) {
      const payload = decodeToken(token);
      if (!payload) throw new Error("Token inválido");
      // Verificar que solo acceder a sessionStorage si hay window
      if (typeof window !== "undefined") {
        sessionStorage.setItem("token", token);
      }
      set({ token, payload, loggedIn: true });
    },
    logout() {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
      }
      set({ token: null, payload: null, loggedIn: false });
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
