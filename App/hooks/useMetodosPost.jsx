import { useContext, useState } from "react";

import axios from "axios";
import JweEncrypt from "../Jwe/JweEncrypt";
import { AuthContext } from "../contexts/AuthContext";
import { KeyContext } from "../contexts/KeyContext";

const useMetodoPost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMoji, setErrorMoji] = useState(null);
  const [response, setResponse] = useState(null);
  const { getUserToken } = useContext(AuthContext);
  const { getKey } = useContext(KeyContext);

  const request = async (
    method = "POST",
    body = null,
    url,
    tokenTemp = null
  ) => {
    setLoading(true);
    setError(null);
    const API_KEY = await getKey();

    const headers = {
      apikey: API_KEY,
    };
    const token = await getUserToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else if (tokenTemp) {
      headers["Authorization"] = `Bearer ${tokenTemp}`;
    }

    let data = await new JweEncrypt().createjwe(body);

    try {
      const response = await axios({
        method,
        url,
        data: data,
        headers,
      });
      if (response.status == 200) {
        if (response.data.responseCode !== "00") {
          throw new Error(`${response.data.responseMessage}`);
        } else {
          setData(response.data);
          setResponse(response);
        }
      }
    } catch (err) {
      let errorMessage;
      let emoji;
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 401:
            errorMessage = "401: Usuario no autorizado";

            emoji = "🚫";
            break;
          case 500:
            errorMessage = "500: Sistema no disponible. Intente más tarde";
            emoji = "⚠️";
            break;
          default:
            errorMessage = "500: Error inesperado. Intente más tarde";
            emoji = "⚠️";
            break;
        }
      } else if (err.request) {
        errorMessage = "No hay conexión a Internet. Verifica tu red";
        emoji = "📶❌";
      } else {
        if (err.message == "undefined") {
          err.message = null;
        }
        errorMessage = err.message ? err.message : "Intente más tarde"; // Si `err` tiene valor, úsalo; si no, usa el mensaje por defecto
        emoji = "⚠️";
      }

      setError(errorMessage.toString().replace(/^Error: /, ""));
      setErrorMoji(emoji);
    } finally {
      setLoading(false);
    }
  };

  const request2 = async (
    method = "POST",
    body = null,
    url,
    tokenTemp = null
  ) => {
    setLoading(true);
    setError(null);
    const API_KEY = await getKey();
    const headers = {
      apikey: API_KEY,
    };

    const token = await getUserToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else if (tokenTemp) {
      headers["Authorization"] = `Bearer ${tokenTemp}`;
    }

    let encryptedData = await new JweEncrypt().createjwe(body);

    try {
      const response = await axios({
        method,
        url,
        data: encryptedData,
        headers,
      });
      if (response.status === 200) {
        if (response.data.responseCode !== "00") {
          if (response.data.responseCode == "66") {
            throw new Error(
              `${response.data.responseCode} : ${response.data.responseMessage}`
            );
          } else {
            throw new Error(`${response.data.responseMessage}`);
          }
        }
        return response.data; // Retorna los datos directamente
      }
    } catch (err) {
      let errorMessage;
      let emoji;
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 401:
            errorMessage = "401: Usuario no autorizado";
            emoji = "🚫";
            break;
          case 500:
            errorMessage = "500: Sistema no disponible. Intente más tarde";
            emoji = "⚠️";
            break;
          default:
            errorMessage = "500: Error inesperado. Intente más tarde";
            emoji = "⚠️";
            break;
        }
      } else if (err.request) {
        errorMessage = "No hay conexión a Internet. Verifica tu red";
        emoji = "📶❌";
      } else {
        errorMessage = err.message || "Intente más tarde";
        emoji = "⚠️";
      }

      throw { message: errorMessage, emoji }; // Lanza el error para manejarlo fuera del hook
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, errorMoji, request, response, request2 };
};

export default useMetodoPost;
