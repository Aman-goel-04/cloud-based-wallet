import { createContext } from "react";

type AuthContextType = {
  jwt: string | null;
  publicKey: string | null;
  login: (jwt: string, publicKey: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);