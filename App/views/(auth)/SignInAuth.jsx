import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import style, { useCustomFonts } from "../../../assets/styles/style";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Buttons from "../../components/Buttons.jsx";
import Colors from "../../../assets/styles/colors.js";
import { useNavigateTo } from "../../hooks/usualFunctions.jsx";
import TitileContainer from "../../components/TitileContainer.jsx";
import { InputPass } from "../../components/InputsForm.jsx";
import BackgroundSignIn from "../../components/BackgroundSignIn.jsx";
import * as SplashScreen from "expo-splash-screen";
import alertError from "../../hooks/useAlertError.jsx";
import useAlert from "../../hooks/useAlert.jsx";
import useMetodoPost from "../../hooks/useMetodosPost.jsx";
import useDeviceId from "../../hooks/useDeviceId.jsx";
import { useTokenUser } from "../../hooks/useTokenUser.jsx";
import { ENDPOINTS } from "../../repository/endpoints.js";
import ProcessingModal from "../../components/ProcessingModal.jsx";
import CustomAlertModal from "../../components/CustomAlertModal.jsx";
import { faSignOut } from "@fortawesome/free-solid-svg-icons/faSignOut";
import { AuthContext } from "../../contexts/AuthContext.js";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import { noback } from "../../hooks/useBackTo.jsx";

const loadFonts = async () => {
  await Font.loadAsync({
    MontBold: require("../../../assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    MontExBold: require("../../../assets/fonts/Montserrat/Montserrat-ExtraBold.ttf"),
    MontLight: require("../../../assets/fonts/Montserrat/Montserrat-Light.ttf"),
    MontReg: require("../../../assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    RobotoMedium: require("../../../assets/fonts/Roboto/Roboto-Medium.ttf"),
    RobotoBlack: require("../../../assets/fonts/Roboto/Roboto-Black.ttf"),
    RobotoBold: require("../../../assets/fonts/Roboto/Roboto-Bold.ttf"),
    RobotoReg: require("../../../assets/fonts/Roboto/Roboto-Regular.ttf"),
    RobotoLight: require("../../../assets/fonts/Roboto/Roboto-Light.ttf"),
  });
};

export default function SignInAuth({ route }) {
  noback();
  const navigation = useNavigation();
  const { isAuthenticated, signOut, signIn } = useContext(AuthContext);
  const { navigateTo } = useNavigateTo();
  const tokenUser = useTokenUser();
  const deviceId = useDeviceId();
  const { request2 } = useMetodoPost();
  const { visible, hideAlert, showAlert } = useAlert();

  const [password, setPassword] = useState(null);
  const [errorAlert, setErrorAlert] = useState("");
  const [emoji, setErrorMoji] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  React.useCallback(() => {
    setPassword(null);
  }, []);

  const OlvideMiPass = () => {
    navigateTo("FgtPwd", { backTo: "User" });
  };

  const handleOnChangeText = (text) => {
    setPassword(text);
  };

  const handleSubmit = async () => {
    hideAlert();
    setErrorAlert("");
    setLoading(false);
    const tokenId = await tokenUser();
    if (!tokenId) {
      alertError();
      return;
    }
    try {
      if (password) {
        setLoading(true);
        showAlert();
        const body = {
          idUser: tokenId,
          password: password,
          deviceId: deviceId,
        };
        const response = await request2("POST", body, ENDPOINTS.LOGIN);
        setPassword("");
        await signIn(response.tokenAuthorization);
        hideAlert();
        if (isAuthenticated) {
          navigateTo("MyTabs");
        }
      }
    } catch (error) {
      hideAlert();
      setLoading(false);

      setErrorAlert(
        error?.message
          ? error.message
          : "Sistema no disponible por el momento. Intente de nuevo más tarde."
      );
      setErrorMoji(error?.emoji ? error.emoji : "⚠️");
      showAlert();
    }
  };

  const alertCancel = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión? Se perderá cualquier progreso no guardado.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: () => {
            signOut(navigation);
          },
        },
      ]
    );
  };

  return (
    <BackgroundSignIn>
      <TitileContainer estilos={{ color: "white", fontSize: 20 }}>
        Bienvenido
      </TitileContainer>

      <InputPass
        icon={faLock}
        placeholder={"Contraseña"}
        onChangeText={handleOnChangeText}
        value={password}
      />

      <TouchableOpacity style={style.linkContainer} onPress={OlvideMiPass}>
        <Text style={[style.textLink, { color: "white" }]}>
          Olvide mi contraseña
        </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 30 }}>
        <Buttons
          bgColor={Colors.Cyan}
          txtColor={"white"}
          tittle="Continuar"
          btnWidth="90%"
          evento={handleSubmit}
        />
      </View>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutCornerButton} onPress={alertCancel}>
        <FontAwesomeIcon icon={faSignOut} color="white"></FontAwesomeIcon>
        <Text style={[style.textLink, styles.logOutText, { color: "white" }]}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
      <CustomAlertModal
        visible={visible}
        onClose={hideAlert}
        icon={emoji}
        message={errorAlert}
        loading={loading}
      />
      {/* <ProcessingModal visible={loading}></ProcessingModal> */}
    </BackgroundSignIn>
  );
}

const styles = StyleSheet.create({
  logoutCornerButton: {
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
    right: 20,
    alignItems: "center",
  },
  logOutText: {
    paddingLeft: 10,
    fontSize: 14,
    // fontWeight: "bold",
    fontFamily: "RobotoLight",
  },
});
