import { User } from "./login";

export let currentUser: User | null = null;

export const setUser = (userData: User) => {
  currentUser = userData;
};

export const logout = () => {
  currentUser = null;
};