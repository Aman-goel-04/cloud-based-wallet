import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [jwt, setJwt] = useState<string | null>(localStorage.getItem("jwt"));
  const [publicKey, setPublicKey] = useState<string | null>(localStorage.getItem("publicKey"));

  const login = (newJwt: string, newPublicKey: string) => {
    localStorage.setItem("jwt", newJwt);
    localStorage.setItem("publicKey", newPublicKey);
    setJwt(newJwt);
    setPublicKey(newPublicKey);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("publicKey");
    setJwt(null);
    setPublicKey(null);
  };

  return (
    <AuthContext.Provider value={{ jwt, publicKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}