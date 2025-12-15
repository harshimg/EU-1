// "use client";
// import { createContext, useContext, useEffect, useState } from "react";

// type User = {
//   user_id: string;
//   email: string;
//   name: string;
//   role: string;
//   semester: number | null;
//   branch: string | null;
//   picture?: string | null;
// };

// type AuthContextType = {
//   user: User | null;
//   token: string | null;
//   login: (token: string, user: User) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: any) {
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("user");

//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   function login(token: string, user: User) {
//     setToken(token);
//     setUser(user);
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//   }

//   function logout() {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   }

//   return (
//     <AuthContext.Provider value={{ token, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext)!;
// }


"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 🔑

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false); // 🔑 auth hydrated
  }, []);

  function login(token: string, user: any) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.clear();
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
