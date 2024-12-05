import "react-native-get-random-values";
import { useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import alertError from "./useAlertError";

function useTokenUser() {
  const fetchToken = async () => {
    try {
      let id = await SecureStore.getItemAsync("Token");
      if (!id) {
        throw new Error("No autorizado");
      }
      return id;
    } catch (error) {
      alertError();
    }
  };

  return fetchToken;
}
function useDeleteTokenUser() {
  const deleteToken = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("Token");
    } catch (error) {
      alertError();
    }
  }, []);

  return deleteToken;
}

export { useTokenUser, useDeleteTokenUser };
