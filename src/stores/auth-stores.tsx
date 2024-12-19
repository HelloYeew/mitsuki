import { atom } from "nanostores";

export const isAuthInitialized = atom(false);
export const isAuthenticated = atom(false);

export const user = atom(null);
