import "react-native-get-random-values"; // Importa esto primero
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import * as SecureStore from "expo-secure-store";
import alertError from "./useAlertError";

function useDeviceId() {
  const [deviceId, setDeviceId] = useState(null);

  async function generateAndStoreDeviceId() {
    try {
      let id = await SecureStore.getItemAsync("device_id");
      if (!id) {
        id = uuidv4();
        await SecureStore.setItemAsync("device_id", id);
      }
      setDeviceId(id);
    } catch (error) {
      alertError();
    }
  }

  useEffect(() => {
    generateAndStoreDeviceId();
  }, []);

  return deviceId;
}

export default useDeviceId;
