import { writable } from "svelte/store";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
}

export const authStore = writable<AuthState>({
  token: null,
  isAuthenticated: false,
  role: null,
});
