import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import colors from "./assets/styles/colors.js";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./App/contexts/AuthContext.js";
import { NavigationContainer } from "@react-navigation/native";
import { KeyProvider } from "./App/contexts/KeyContext.js";
import AuthNavigation from "./navegacion/AuthNavigation.jsx";
import UserNavigation from "./navegacion/UserNavigation.jsx";
import AppNavigation from "./navegacion/AppNavigation.jsx";
import AppWrapper from "./App/components/AppWrapper.js";

export default function App() {
  return (
    <KeyProvider>
      <AuthProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.AzulCopay}
        />
        <NavigationContainer>
          <AppWrapper>
            <AppNavigation></AppNavigation>
          </AppWrapper>
        </NavigationContainer>
      </AuthProvider>
    </KeyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
