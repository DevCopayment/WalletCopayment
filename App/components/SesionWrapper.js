import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  AppState,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCheckTokenExpiration } from "../hooks/useCheckTokenExpiration";
import { AuthContext } from "../contexts/AuthContext";

const SesionWrapper = ({ children }) => {
  const navigation = useNavigation();
  const { getUserToken } = useContext(AuthContext);
  const checkTokenExpiration = useCheckTokenExpiration();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [nestedRouteName, setNestedRouteName] = useState("");
  // ?validacion TOKEN
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await getUserToken();

        if (token) {
          const isValid = await checkTokenExpiration();
          const currentState = navigation.getState();
          const currentRoute = currentState.routes[currentState.index];

          if (currentRoute?.state) {
            const nestedState = currentRoute.state;
            const nestedRoute = nestedState.routes[nestedState.index];
            setNestedRouteName(nestedRoute.name);
          }
          // console.log(nestedRouteName);
          if (nestedRouteName != "" && nestedRouteName != "SignInAuth") {
            if (isValid) {
              Alert.alert(
                "Sesión Expirada",
                "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
                [
                  {
                    text: "Aceptar",
                    onPress: () => {
                      navigation.navigate("User", { screen: "SignInAuth" });
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        navigation.navigate("User", { screen: "SignInAuth" });
      } finally {
        setLoading(false); // Termina la carga cuando se haya validado el token
      }
    };

    verifyToken();
  }, [navigation, checkTokenExpiration]);
  // ?validacion TOKEN

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};
export default SesionWrapper;
