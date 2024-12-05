import { useContext } from "react";
import Indice from "../App/views/Indice";
import SignUp from "../App/views/(auth)/SignUp";
import SignIn from "../App/views/(auth)/SignIn";
import AuthCode from "../App/views/(auth)/AuthCode";
import ForgotPwd from "../App/views/(auth)/ForgotPwd";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import colors from "../assets/styles/colors";
import { AuthContext } from "../App/contexts/AuthContext";
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
const AuthNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Indice">
      <Stack.Screen
        name="Indice"
        component={Indice}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FgtPwd"
        component={ForgotPwd}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthCode"
        component={AuthCode}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default AuthNavigation;
