import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Alert, AppState, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutos en milisegundos

const AppWrapper = ({ children }) => {
  const navigation = useNavigation();
  const { getUserToken } = useContext(AuthContext);
  const inactivityTimer = useRef(null);
  const [nestedRouteName, setNestedRouteName] = useState("");

  // Función para manejar la inactividad
  const handleInactivity = async () => {
    const token = await getUserToken();
    Alert.alert(
      "Inactividad",
      "Has sido desconectado por inactividad.",
      [
        {
          text: "Aceptar",
          onPress: () => {
            if (token) {
              navigation.navigate("SignInAuth");
            } else {
              navigation.navigate("User", { screen: "Indice" });
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Función para reiniciar el temporizador de inactividad
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      handleInactivity();
    }, INACTIVITY_LIMIT);
  };

  // Efecto para configurar el listener de estado de la app
  useEffect(() => {
    if (nestedRouteName != "" && nestedRouteName != "SignInAuth") {
      resetInactivityTimer(); // Configuración inicial del temporizador
    }

    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          resetInactivityTimer(); // Reinicia el temporizador cuando la app vuelve a estar activa
        } else if (nextAppState === "background") {
          clearTimeout(inactivityTimer.current);
        }
      }
    );

    return () => {
      clearTimeout(inactivityTimer.current); // Limpieza del temporizador al desmontar
      appStateListener.remove();
    };
  }, []);

  // Manejar interacción del usuario
  const handleUserInteraction = () => {
    const currentState = navigation.getState();
    let currentRoute = null;
    if (currentState) {
      currentRoute = currentState.routes[currentState.index];
    }
    setNestedRouteName(currentRoute?.name ? currentRoute.name : "");

    if (currentRoute?.state) {
      const nestedState = currentRoute.state;
      const nestedRoute = nestedState.routes[nestedState.index];
      setNestedRouteName(nestedRoute.name);
    }

    if (nestedRouteName != "" && nestedRouteName != "SignInAuth") {
      resetInactivityTimer();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleUserInteraction}>
      <View style={{ flex: 1 }} onTouchStart={handleUserInteraction}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AppWrapper;
