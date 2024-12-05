// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para la carga inicial
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userToken = await SecureStore.getItemAsync("Token");
        const userFirst = await SecureStore.getItemAsync("InitialRoute");
        setIsFirstTime(!!userFirst);
        setIsAuthenticated(!!userToken);
      } finally {
        setIsLoading(false); // Finaliza la carga una vez comprobado el token
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (token) => {
    await SecureStore.setItemAsync("InitialRoute", "true");
    setIsFirstTime(true);
    await SecureStore.setItemAsync("Token", token);
    setIsAuthenticated(true);
  };

  const signOut = async ({ navigation }) => {
    await SecureStore.deleteItemAsync("Token");
    setIsAuthenticated(false);
    navigation.navegar("Indice");
  };
  const noFirstTime = async () => {
    await SecureStore.deleteItemAsync("InitialRoute");
    setIsFirstTime(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        signIn,
        signOut,
        getUserToken,
        noFirstTime,
        isFirstTime,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const getUserToken = async () => {
  return await SecureStore.getItemAsync("Token");
};
