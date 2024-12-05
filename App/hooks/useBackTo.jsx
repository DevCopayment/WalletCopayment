// hooks/useRedirectOnBack.js
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert, BackHandler } from "react-native";

// Hook para mostrar una alerta al intentar volver atrás
const alertCancel = (onConfirm) => {
  Alert.alert(
    "¿Quieres salir?",
    "Si continúas, perderás el progreso de cualquier acción que estés realizando.",
    [
      {
        text: "Cancelar",
      },
      {
        text: "Aceptar",
        onPress: onConfirm,
        // Llama al callback si el usuario acepta
      },
    ]
  );
};

const useCancelProcess = (redirectTo) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type !== "NAVIGATE") {
        e.preventDefault(); // Previene la navegación
      }
      if (e.data.action.type === "GO_BACK") {
        alertCancel(() => {
          // Esta función se ejecuta si el usuario confirma
          //   navigation.dispatch(e.data.action); // Realiza la acción que intentaba hacer el usuario
          navigation.navigate(redirectTo); // Navega a la ruta de redirección
        });
      }
      if (e.data.action.type === "POP") {
        alertCancel(() => {
          // Esta función se ejecuta si el usuario confirma
          //   navigation.dispatch(e.data.action); // Realiza la acción que intentaba hacer el usuario
          navigation.navigate(redirectTo); // Navega a la ruta de redirección
        });
      }
    });

    return unsubscribe; // Limpia el listener al desmontar
  }, [navigation, redirectTo]);
};
const noback = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type !== "NAVIGATE") {
        e.preventDefault(); // Previene la navegación
        BackHandler.exitApp();
      }
    });
    return unsubscribe; // Limpia el listener al desmontar
  });
};

// Hook para navegar hacia atrás sin alerta
const useBackTo = (redirectTo) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (
        e.data.action.type === "GO_BACK" ||
        e.data.action.type === "POP" ||
        e.data.action.type === "RESET"
      ) {
        e.preventDefault(); // Previene la navegación
        navigation.navigate(redirectTo); // Navega a la ruta de redirección si es necesario
      }
    });

    return unsubscribe;
  }, [navigation, redirectTo]);
};

export { useCancelProcess, useBackTo, alertCancel, noback };
