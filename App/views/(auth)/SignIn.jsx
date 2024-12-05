import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Buttons from "../../components/Buttons.jsx";
import Colors from "../../../assets/styles/colors.js";
import BackgroundCustom from "../../components/BackgroundCustom.jsx";
import { CardNumberInput, InputPass } from "../../components/InputsForm.jsx";
import { useForm } from "../../hooks/useForm.jsx";
import TitileContainer from "../../components/TitileContainer.jsx";
import { ENDPOINTS } from "../../repository/endpoints.js";
import useMetodoPost from "../../hooks/useMetodosPost.jsx";
import useDeviceId from "../../hooks/useDeviceId.jsx";
import { useNavigateTo } from "../../hooks/usualFunctions.jsx";
import { useBackTo } from "../../hooks/useBackTo.jsx";
import CustomAlertModal from "../../components/CustomAlertModal.jsx";
import useAlert from "../../hooks/useAlert.jsx";
import ProcessingModal from "../../components/ProcessingModal.jsx";
import colors from "../../../assets/styles/colors.js";
import style from "../../../assets/styles/style.jsx";
import { KeyContext } from "../../contexts/KeyContext.js";
const SignIn = () => {
  // * FUNCTIONS
  useBackTo("Indice");
  // * FUNCTIONS

  // ? NAVEGACION HACIA ATRAS

  // ? FORMULARIO
  const { formValues, errors, handleChange, validateForm, reset } = useForm({
    cardNumber: "",
    pass: "",
  });
  // ? FORMULARIO

  // ? METODO POST
  const { request2 } = useMetodoPost();
  const { visible, hideAlert, showAlert } = useAlert();
  const { navigateTo } = useNavigateTo();
  const [loading, setLoading] = useState(false); // Control para resetear el input
  const [error, setError] = useState(""); // Control para resetear el input
  const [errorMoji, setErrorMoji] = useState(""); // Control para resetear el input

  const [resetCard, setResetCard] = useState(false); // Control para resetear el input
  const { setKeyByCard } = useContext(KeyContext);
  // ? METODO POST

  const device_id = useDeviceId();
  const resetCardNumber = () => {
    setResetCard(true); // Activamos el reset
    setTimeout(() => {
      setResetCard(false); // Desactivamos el reset después de un ciclo para evitar resets repetidos inmediatos
    }, 0);
  };

  const handleSubmit = async () => {
    hideAlert();
    setError("");
    try {
      if (validateForm()) {
        setLoading(true);
        showAlert();
        const body = {
          cardNumber: formValues.cardNumber.replace(/\s+/g, ""),
          password: formValues.pass,
          deviceId: device_id,
        };
        setKeyByCard(body.cardNumber);
        const response = await request2("POST", body, ENDPOINTS.LOGINFIRST);

        const newbody = {
          cardNumber: formValues.cardNumber.replace(/\s+/g, ""),
          password: formValues.pass,
          deviceId: device_id,
          tokenTemp: response.tokenAuthorization,
        };
        reset();
        resetCardNumber();
        hideAlert();

        navigateTo("AuthCode", {
          backTo: "Indice",
          tipoFlujo: "LOGIN",
          tipoReenvio: "LOGINREENVIO",
          campos: newbody,
          goTo: "User",
        });
      }
    } catch (error) {
      hideAlert();
      setLoading(false);
      reset();
      resetCardNumber();
      setError(
        error?.message
          ? error.message
          : "Sistema no disponible por el momento. Intente de nuevo más tarde."
      );
      setErrorMoji(error?.emoji ? error.emoji : "⚠️");
      showAlert();
    }
  };

  return (
    <BackgroundCustom backTo={"Indice"}>
      {/* CONTAINER */}
      {/* TITULO */}
      <TitileContainer>Iniciar Sesión</TitileContainer>
      {/* TITULO */}
      {/* FORM */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        extraHeight={100}>
        <CardNumberInput
          onChangeText={(value) => handleChange("cardNumber", value)}
          error={errors.cardNumber}
          placeholder={"Número de tarjeta"}
          resetValue={resetCard}
          // value={formValues.cardNumber}
        />

        <InputPass
          icon={faLock}
          onChangeText={(value) => handleChange("pass", value)}
          placeholder="Contraseña"
          value={formValues.pass}
        />
        <View style={styles.BtnContainer}>
          <Buttons
            bgColor={Colors.AzulCopay}
            txtColor="white"
            tittle="Continuar"
            btnWidth="90%"
            evento={handleSubmit}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigateTo("FgtPwd", { backTo: "SignIn" })}>
          <Text
            style={[
              style.textLink,
              { paddingTop: 10, fontFamily: "MontLight" },
            ]}>
            Olvide mi contraseña
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            padding: 15,
          }}>
          <Text style={styles.LeyendaInicio}>¿No tienes cuenta?</Text>
          <Text
            onPress={() => {
              reset(), resetCardNumber(), navigateTo("SignUp");
            }}
            style={[
              styles.LeyendaInicio,
              { color: colors.AzulCopay, paddingLeft: 5, fontWeight: "500" },
            ]}>
            Registrate aqui.
          </Text>
        </View>
        <CustomAlertModal
          visible={visible}
          onClose={hideAlert}
          icon={errorMoji}
          message={error}
          loading={loading}
        />
      </ScrollView>
      {/* FORM */}
      {/* CONTAINER */}
    </BackgroundCustom>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centrado vertical
    alignItems: "center", // Centrado horizontal
    paddingHorizontal: 20,
  },
  scrollContainer: {
    // alignItems: "center",
    // width: "100%",
  },
  BtnContainer: {
    marginTop: 25,
  },
  LeyendaInicio: {
    fontFamily: "MontLight",
    fontSize: 12,
    // padding: 10,

    textAlign: "center",
  },
});

export default SignIn;
