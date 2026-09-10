import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 reload হলে user check
  const checkAuth = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/internal-auth/me.php`,
        { credentials: "include" },
      );

      const data = await res.json();
      setUser(data?.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔹 login
  const login = async (id, password) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/internal-auth/login.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id, password }),
        },
      );

      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 logout
  const logout = async () => {
    await fetch(
      `${import.meta.env.VITE_LOCALHOST_KEY}/internal-auth/logout.php`,
      { credentials: "include" },
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
 isAdmin: user?.role?.includes("admin"),       // ✅ admin check
        isStaff: user?.role?.includes("staff"),       // ✅ staff check
        isManager: user?.role?.includes("manager"),   // ✅ manager check
        isDeveloper: user?.role?.includes("developer"), 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
