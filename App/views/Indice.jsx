import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ImageBackground,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { style, useCustomFonts } from "../../assets/styles/style.jsx"; // Ajusta la ruta según sea necesario
import logo_main from "../../assets/images/logo_main.png";
import { StatusBar } from "expo-status-bar";
import { useNavigateTo } from "../hooks/usualFunctions.jsx";
import Buttons from "../components/Buttons.jsx";
import bg_main from "../../assets/images/bg_main.gif";
import useDeviceId from "../hooks/useDeviceId.jsx";
import * as Font from "expo-font";
import { noback } from "../hooks/useBackTo.jsx";

const loadFonts = async () => {
  await Font.loadAsync({
    MontBold: require("../../assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    MontExBold: require("../../assets/fonts/Montserrat/Montserrat-ExtraBold.ttf"),
    MontLight: require("../../assets/fonts/Montserrat/Montserrat-Light.ttf"),
    MontReg: require("../../assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    RobotoMedium: require("../../assets/fonts/Roboto/Roboto-Medium.ttf"),
    RobotoBlack: require("../../assets/fonts/Roboto/Roboto-Black.ttf"),
    RobotoBold: require("../../assets/fonts/Roboto/Roboto-Bold.ttf"),
    RobotoReg: require("../../assets/fonts/Roboto/Roboto-Regular.ttf"),
    RobotoLight: require("../../assets/fonts/Roboto/Roboto-Light.ttf"),
  });
};

const Indice = () => {
  noback();
  const { navigateTo } = useNavigateTo();
  const labelBtn1 = "Regístrate";
  const labelBtn2 = "Iniciar sesión";
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const deviceId = useDeviceId();

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ImageBackground style={style.bg_img} source={bg_main}>
      <StatusBar style="light" />
      {/* CONTENIDO */}
      <SafeAreaView style={style.safeAreaView}>
        {/* LOGO */}
        <View style={styles.container}>
          <View style={styles.logo_main_container}>
            <Image source={logo_main} style={styles.logo_main}></Image>
          </View>
        </View>
        {/* LOGO */}

        {/* BUTTONS VIEW */}
        <View style={styles.btnMainContainer}>
          <View style={styles.btnContainer}>
            <Buttons tittle={labelBtn1} evento={() => navigateTo("SignUp")} />
          </View>
          <View style={styles.btnContainer}>
            <Buttons tittle={labelBtn2} evento={() => navigateTo("SignIn")} />
          </View>
        </View>
        {/* BUTTONS VIEW */}
      </SafeAreaView>
      {/* FIN DE CONTENIDO */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
  },
  logo_main_container: {
    width: "100%",
    height: "50%",
  },
  btnMainContainer: {
    flex: 1,
    marginTop: 25,
  },
  btnContainer: {
    marginVertical: 15,
  },
  logo_main: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Indice;
