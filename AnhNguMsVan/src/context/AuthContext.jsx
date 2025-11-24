import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { token, user, loading: !!token };
  });

  // gọi /me khi có token để rehydrate user
  useEffect(() => {
    const fetchMe = async () => {
      if (!auth.token) {
        setAuth((prev) => ({ ...prev, loading: false }));
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        if (!res.ok) throw new Error("invalid token");
        const data = await res.json();
        const user = data.data?.user || data.user;
        localStorage.setItem("user", JSON.stringify(user));
        setAuth({ token: auth.token, user, loading: false });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth({ token: null, user: null, loading: false });
      }
    };
    fetchMe();
  }, [auth.token]);

  const login = (apiData) => {
    const token = apiData?.data?.token || apiData?.token;
    const user = apiData?.data?.user || apiData?.user;
    if (!token || !user) return;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
