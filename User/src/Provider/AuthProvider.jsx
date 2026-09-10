import React, { createContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 প্রথম লোডে localStorage থেকে user রিড করব
  useEffect(() => {
    const saved = localStorage.getItem("investorUser");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("investorUser");
      }
    }
    setLoading(false);
  }, []);

  // 🔹 ID + Password দিয়ে Firestore থেকে check
  const loginWithIdAndPassword = async (id, password) => {
    setLoading(true);

    const userRef = doc(db, "users", String(id)); // নিশ্চিতভাবে string
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      setLoading(false);
      throw new Error("❌ এই ID দিয়ে কোনো user পাওয়া যায় নাই");
    }

    const data = snap.data();

    if (!data.active) {
      setLoading(false);
      throw new Error("❌ এই user এর access বন্ধ আছে");
    }

    if (data.password !== password) {
      setLoading(false);
      throw new Error("❌ Password ভুল");
    }

    const loggedUser = {
      id: String(id),
      name: data.name || "",
    };

    setUser(loggedUser);
    localStorage.setItem("investorUser", JSON.stringify(loggedUser)); // 🔥 refresh safe
    setLoading(false);
    return loggedUser;
  };

  // 🔹 Logout
  const logOut = () => {
    setUser(null);
    localStorage.removeItem("investorUser");
  };

  const authValue = {
    user,
    loading,
    setLoading,
    loginWithIdAndPassword,
    logOut,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
