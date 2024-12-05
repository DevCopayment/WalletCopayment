import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "../../../assets/styles/colors";
import { useNavigateTo } from "../../hooks/usualFunctions";
import Buttons from "../../components/Buttons";
import TitileContainer from "../../components/TitileContainer";
import BackgroundColor from "../../components/BackgroundColor";
import { InputCode } from "../../components/InputsForm";
import { useForm } from "../../hooks/useForm";
import { useCancelProcess } from "../../hooks/useBackTo";
import useMetodoPost from "../../hooks/useMetodosPost";
import useAlert from "../../hooks/useAlert";
import { ENDPOINTS } from "../../repository/endpoints";
import CustomAlertModal from "../../components/CustomAlertModal";
import ProcessingModal from "../../components/ProcessingModal";
import SuccessModal from "../../components/SuccessModal";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import colors from "../../../assets/styles/colors";
const FLUJOS = {
  REGISTRO: {
    endpoint: ENDPOINTS.REGISTRO,
    mensajeExito: "Registro exitoso. Código validado.",
  },
  PREREGISTRO: {
    endpoint: ENDPOINTS.PREREGISTRO,
    mensajeExito: "Regsitro",
  },
  LOGIN: {
    endpoint: ENDPOINTS.LOGINCODIGO,
    mensajeExito: "Inicio de sesión exitoso.",
  },
  LOGINREENVIO: {
    endpoint: ENDPOINTS.LOGINFIRST,
    mensajeExito: "Inicio de sesión exitoso.",
  },
  RECUPERAR: {
    endpoint: ENDPOINTS.SOLCONTRA,
    mensajeExito:
      "¡Tu contraseña ha sido restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.",
  },
  RESCONTRA: {
    endpoint: ENDPOINTS.RESCONTRA,
    mensajeExito:
      "¡Tu contraseña ha sido restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.",
  },
};

export default function AuthCode({ route }) {
  const navigation = useNavigation();
  const { backTo, tipoFlujo, tipoReenvio, campos, goTo } = route.params;
  const flujoConfig = FLUJOS[tipoFlujo];
  const flujoConfigReenvio = FLUJOS[tipoReenvio];
  const [tipoRequest, setTipoRequest] = useState(null);
  const { signIn } = useContext(AuthContext);

  useCancelProcess(backTo);
  const { navigateTo } = useNavigateTo();

  const [codigo, setCodigo] = useState("");
  const [alertError, setAlertError] = useState("");
  const [successVisible, setSuccesVisible] = useState(false);
  const [mensajeSucces, setMensajeSucces] = useState("");
  // ? FORMULARIO
  const { formValues, errors, handleChange, validateForm, reset } = useForm({
    codigo: codigo,
  });
  // ? FORMULARIO
  // ? METODO POST
  const { request2 } = useMetodoPost();
  const [loading, setLoading] = useState(false);
  const [emoji, setErrorMoji] = useState("");

  const { visible, hideAlert, showAlert } = useAlert();
  // ? METODO POST

  // ?TIEMPO ESPERA BTN REENVIO CODIGO
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setIsWaiting(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = async () => {
    hideAlert();
    setAlertError("");
    try {
      if (validateForm()) {
        setLoading(true);
        showAlert();
        let body = null;
        if (tipoRequest == "LOGIN") {
          body = {
            codigo: formValues.codigo,
          };
        } else {
          body = {
            ...campos,
            codigo: formValues.codigo,
          };
        }
        const response = await request2(
          "POST",
          body,
          flujoConfig.endpoint,
          campos.tokenTemp
        );
        reset();

        setMensajeSucces(flujoConfig.mensajeExito);
        hideAlert();
        setSuccesVisible(true);
        let timer = setTimeout(async () => {
          setSuccesVisible(false);
          if (goTo === "User") {
            if (tipoFlujo === "REGISTRO" || tipoFlujo == "LOGIN") {
              const token = body.tokenTemp || response.tokenWallet;
              await signIn(token);
            } else {
              navigateTo(goTo, {});
            }
          } else {
            navigateTo(goTo, {});
          }
        }, 3000); // Duración en milisegundos
      }
    } catch (error) {
      setLoading(false);

      hideAlert();
      setAlertError(
        error?.message
          ? error.message
          : "Sistema no disponible por el momento. Intente de nuevo más tarde."
      );
      setErrorMoji(error?.emoji ? error.emoji : "⚠️");
      showAlert();
    }
  };

  const handleReenvio = async () => {
    hideAlert();
    setAlertError("");
    setLoading(false);
    try {
      if (!isWaiting) {
        setLoading(true);
        showAlert();
        const response = await request2(
          "POST",
          campos,
          flujoConfigReenvio.endpoint
        );
        setIsWaiting(true);
        setTimeLeft(30);
        hideAlert();
        setLoading(false);
      }
    } catch (error) {
      hideAlert();
      setLoading(false);
      setAlertError(
        error?.message
          ? error.message
          : "Sistema no disponible por el momento. Intente de nuevo más tarde."
      );
      setErrorMoji(error?.emoji ? error.emoji : "⚠️");
      showAlert();
    }
  };

  return (
    <BackgroundColor color={"white"} backTo={backTo}>
      <View style={{ flex: 1, top: "10%" }}>
        {/* <StatusBar backgroundColor={colors.AzulCopay}></StatusBar> */}
        {/* FORM */}
        {/* TITLE */}
        <TitileContainer>Código de Verificación</TitileContainer>
        {/* TITLE */}
        {/* LEYENDA */}
        <View>
          <Text style={styles.leyendaText}>
            Te hemos enviado un código de verificación a tu correo electrónico.
            Por favor, ingrésalo para continuar.
          </Text>
        </View>
        {/* LEYENDA */}
        <InputCode
          length={6}
          onChangeCode={(value) => handleChange("codigo", value)}
          error={errors.codigo}></InputCode>
        {/* CONTINUAR BTN */}

        <View style={{ marginTop: 20 }}>
          <Buttons
            btnWidth="90%"
            bgColor={Colors.AzulCopay}
            txtColor="white"
            tittle="Aceptar"
            evento={handleSubmit}></Buttons>
        </View>
        {/* CONTINUAR BTN */}
        <TouchableOpacity
          style={styles.viewTextLink}
          onPress={handleReenvio}
          disabled={isWaiting}>
          <Text style={[styles.textLink, isWaiting && { color: "grey" }]}>
            {isWaiting ? `Reenviar código en ${timeLeft}s` : "Reenviar código"}
          </Text>
        </TouchableOpacity>
        {/* FORM */}
      </View>
      <CustomAlertModal
        visible={visible}
        onClose={hideAlert}
        icon={emoji}
        message={alertError}
        loading={loading}
      />
      <SuccessModal visible={successVisible} message={mensajeSucces} />
    </BackgroundColor>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    // backgroundColor: "red",
    flex: 1,
    alignContent: "center",
    padding: 30,
    marginTop: "10%",
  },
  leyendaText: {
    textAlign: "justify",
    paddingVertical: 10,
    fontFamily: "RobotoReg",
  },
  inputsContainer: {
    flexDirection: "row",
    backgroundColor: "red",
    // flex: 1,
  },
  inputContainer: {
    // width: "20%",
    flex: 1,
  },
  inputCodeContainer: {
    // flex: 1,
    // margin: 10,
    marginVertical: 50,
    // paddingHorizontal: 10,
    // backgroundColor: "red",
  },
  viewTextLink: {
    marginTop: 20,
  },
  textLink: {
    textAlign: "center",
    fontFamily: "RobotoReg",
    fontSize: 12,
  },
});
