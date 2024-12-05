import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Transfer from "../App/views/(tabs)/Transfer/Transfer";
import FormTransfer from "../App/views/(tabs)/Transfer/FormTransfer";
import PasswordForm from "../App/views/(tabs)/Transfer/PasswordForm";
import TransferReceipt from "../App/views/(tabs)/Transfer/ComprobanteSkia";
import Home from "../App/views/(tabs)/Home";
import Movs from "../App/views/(tabs)/Movs";
import { useNavigation } from "@react-navigation/native";
import useMetodoPost from "../App/hooks/useMetodosPost";
import { useContext, useEffect, useState } from "react";
import {
  faChevronLeft,
  faHome,
  faKey,
  faMoneyBillTransfer,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Nip from "../App/views/(tabs)/Nip";
import Account from "../App/views/(tabs)/Account.jsx";

import { BalanceProvider } from "../App/contexts/BalanceContext";
import SignInAuth from "../App/views/(auth)/SignInAuth";
import colors from "../assets/styles/colors";
import ForgotPwd from "../App/views/(auth)/ForgotPwd";
import AuthCode from "../App/views/(auth)/AuthCode";
import { ENDPOINTS } from "../App/repository/endpoints.js";
import { Text } from "react-native";
import { AuthContext } from "../App/contexts/AuthContext.js";
import LoadingScreen from "../App/components/LoadingScreen.jsx";
import AppWrapper from "../App/components/AppWrapper.js";
import SesionWrapper from "../App/components/SesionWrapper.js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyleConfig = {
  headerShown: true,
  headerStyle: {
    backgroundColor: colors.AzulCopay,
  },
  headerTintColor: "white",
  headerTitleStyle: {
    fontFamily: "MontReg",
    letterSpacing: 1,
  },
  headerBackTitle: "",
  headerTitleAlign: "center",
};

const tabBarConfig = {
  tabBarStyle: {
    backgroundColor: "white",
    elevation: 0,
    height: 65,
    paddingBottom: 40,
    marginBottom: 8,
    paddingTop: 5,
  },
  // marginBottom: 0,
  tabBarActiveTintColor: colors.Cyan,
  tabBarInactiveTintColor: colors.AzulCopay,
};

const SesionActiva = () => {
  const navigation = useNavigation();

  const { loading, request2 } = useMetodoPost();
  const [timeNip, setTimeNip] = useState(15);
  const [modulos, setModulos] = useState({
    Nip: false,
    Trans: false,
  });
  const [isReady, setIsReady] = useState(false); // Estado para verificar si los módulos están cargados

  const getModulos = async () => {
    try {
      const body = {
        props: "props",
      };
      const propsResponse = await request2("POST", body, ENDPOINTS.PROPS);
      setModulos(propsResponse.modulos);
      setTimeNip(propsResponse.tiempoNip);
      setIsReady(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getModulos();
  }, []);
  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00acff" />
        <Text style={styles.text}>Cargando...</Text>
      </View>
    );
  }
  return (
    <Tab.Navigator initialRouteName="Inicio" screenOptions={tabBarConfig}>
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={styles.viewTabs}>
              <FontAwesomeIcon icon={faHome} color={color} size={25} />
            </View>
          ),
        }}
      />
      {modulos.Trans == "true" && (
        <Tab.Screen
          name="Transferir"
          component={Transfer}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon
                icon={faMoneyBillTransfer}
                color={color}
                size={25}
              />
            ),
          }}
        />
      )}
      {modulos.Nip === "true" && (
        <Tab.Screen
          name="NIP"
          options={{
            headerShown: false,

            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faKey} color={color} size={25} />
            ),
          }}>
          {() => <Nip timeNip={timeNip} />}
        </Tab.Screen>
      )}

      <Tab.Screen
        name="Perfil"
        component={Account}
        options={({ navigation }) => ({
          ...headerStyleConfig,
          headerTitle: "PERFIL",

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Inicio", { screen: "Home" })}
              style={{ marginLeft: 20 }}>
              <FontAwesomeIcon icon={faChevronLeft} color={"white"} size={20} />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} color={color} size={25} />
          ), // Ocultar la barra de pestañas
        })}
      />
    </Tab.Navigator>
  );
};

const UserNavigation = () => {
  const { isAuthenticated, isLoading, isFirstTime } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BalanceProvider>
      <SesionWrapper>
        <Stack.Navigator
          initialRouteName={isFirstTime ? "MyTabs" : "SignInAuth"}>
          <Stack.Screen
            name="SignInAuth"
            component={SignInAuth}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FormTransferScreen"
            component={FormTransfer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyTabs"
            component={SesionActiva}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Movs"
            component={Movs}
            options={{ ...headerStyleConfig, title: "Movimientos" }}
          />

          <Stack.Screen
            name="PasswordScreen"
            component={PasswordForm}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Comprobante"
            component={TransferReceipt}
            options={{
              ...headerStyleConfig,
              headerTitle: "COMPROBANTE",
            }}
          />
        </Stack.Navigator>
      </SesionWrapper>
    </BalanceProvider>
  );
};

export default UserNavigation;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
