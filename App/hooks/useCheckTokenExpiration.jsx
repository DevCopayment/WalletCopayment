import { Alert } from "react-native";
import { useNavigateTo } from "./usualFunctions";
import { useCallback, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

export const useCheckTokenExpiration = () => {
  const { getUserToken } = useContext(AuthContext);
  const navigateTo = useNavigateTo(); // Aquí se necesita asegurarse de que useNavigateTo esté funcionando bien.

  const checkTokenExpiration = useCallback(async () => {
    const token = await getUserToken();
    if (!token) {
      return true;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      if (decodedToken.exp < currentTime) {
        return true; // Si el token ha expirado
      }

      return false; // Si el token es válido
    } catch (error) {
      return true; // Si no se puede decodificar, lo consideramos inválido.
    }
  }, [getUserToken, navigateTo]);

  return checkTokenExpiration;
};
