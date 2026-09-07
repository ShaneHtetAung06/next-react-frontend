//src/context/UserContext.jsx

import { createContext, useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const UserContext = createContext();

export function UserProvider({ children }) {
  const isInit = useRef(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [isLogInError, setIsLoginError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;
    me();
  }, []);

  const me = async () => {
    try {
      const result = await fetch(`${API_URL}/api/me`, {
        credentials: "include",
      });
      if (result.ok) {
        const data = await result.json();
        console.log("==>user data: ", data);
        setUser(data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("==>me() error: ", error);
    }
    setIsInitializing(false);
  };

  const login = async (email, password) => {
    const body = {
      email: email,
      password: password,
    };
    console.log("==>Login body: ", body);
    try {
      const result = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (result.ok) {
        // Login endpoint only returns { message }, so fetch user data via /me
        await me();
        setIsLoggedIn(true);
        setIsLoginError(false);
        setLoginErrorMsg("");
        return true;
      } else {
        const errData = await result.json();
        console.log("==>Login failed: ", errData.error);
        setIsLoggedIn(false);
        setIsLoginError(true);
        setLoginErrorMsg(errData.error || "Login failed");
        return false;
      }
    } catch (error) {
      console.log("==>Login exception: ", error);
      setIsLoggedIn(false);
      setIsLoginError(true);
      setLoginErrorMsg("Network error");
      return false;
    }
  };

  const logout = async () => {
    try {
      const result = await fetch(`${API_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (result.ok) {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("==>Logout error: ", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        isLogInError,
        loginErrorMsg,
        isInitializing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
