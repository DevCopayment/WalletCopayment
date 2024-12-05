import { StyleSheet, Platform } from "react-native";
import { useFonts } from "expo-font";
import Constants from "expo-constants";

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    MontBold: require("../fonts/Montserrat/Montserrat-Bold.ttf"),
    MontExBold: require("../fonts/Montserrat/Montserrat-ExtraBold.ttf"),
    MontLight: require("../fonts/Montserrat/Montserrat-Light.ttf"),
    MontReg: require("../fonts/Montserrat/Montserrat-Regular.ttf"),
    RobotoMedium: require("../fonts/Roboto/Roboto-Medium.ttf"),
    RobotoBlack: require("../fonts/Roboto/Roboto-Black.ttf"),
    RobotoBold: require("../fonts/Roboto/Roboto-Bold.ttf"),
    RobotoReg: require("../fonts/Roboto/Roboto-Regular.ttf"),
    RobotoLight: require("../fonts/Roboto/Roboto-Light.ttf"),
  });

  return fontsLoaded;
};

export const style = StyleSheet.create({
  // ?
  safeAreaView: {
    paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : 30,
    flex: 1,
  },
  bg_img: {
    flex: 1,
  },
  // ?

  // *

  // *
  // * Back Button

  // *
  // * LINK LEYENDA
  textLink: {
    fontFamily: "RobotoLight",
    textAlign: "center",
    fontSize: 12,
  },

  linkContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  // *
  // * FORMULARIO

  // *
  // * ARCO CYAN
});

export default style;
