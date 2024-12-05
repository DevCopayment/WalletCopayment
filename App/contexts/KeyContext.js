// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { apiKeys } from "../repository/endpoints";

export const KeyContext = createContext();

export const KeyProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setKeyByCard = async (cardNumber) => {
    const bin = cardNumber.slice(0, 6);
    if (bin.startsWith("4")) {
      await SecureStore.setItemAsync("apikey", apiKeys.visa);
      await SecureStore.setItemAsync("ambiente", "visa");
    } else {
      await SecureStore.setItemAsync("apikey", apiKeys.carnet);
      await SecureStore.setItemAsync("ambiente", "carnet");
    }
  };

  const setKey = async (token) => {
    await SecureStore.setItemAsync("apikey", token);
  };

  return (
    <KeyContext.Provider
      value={{
        setKey,
        setKeyByCard,
        getKey,
        getAmbiente,
      }}>
      {children}
    </KeyContext.Provider>
  );
};

const getKey = async () => {
  const apikey = await SecureStore.getItemAsync("apikey");

  return apikey;
};

const getAmbiente = async () => {
  const apikey = await SecureStore.getItemAsync("ambiente");
  if (apikey) {
    return apikey;
  } else {
    return "carnet";
  }
};
