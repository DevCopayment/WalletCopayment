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
import UserNavigation from "./UserNavigation";
import AuthNavigation from "./AuthNavigation";
import LoadingScreen from "../App/components/LoadingScreen";
import AppWrapper from "../App/components/AppWrapper";
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
const AppNavigation = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <Stack.Navigator initialRouteName="User">
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
      {isAuthenticated ? (
        <Stack.Screen
          name="User"
          component={UserNavigation}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="User"
          component={AuthNavigation}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
export default AppNavigation;
