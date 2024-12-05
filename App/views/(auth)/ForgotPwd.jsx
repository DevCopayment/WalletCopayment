import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Buttons from "../../components/Buttons.jsx";
import Colors from "../../../assets/styles/colors.js";
import { useNavigateTo } from "../../hooks/usualFunctions.jsx";
import { useForm } from "../../hooks/useForm.jsx";
import { CardNumberInput, Input } from "../../components/InputsForm.jsx";
import TitileContainer from "../../components/TitileContainer.jsx";
import BackgroundCustom from "../../components/BackgroundCustom.jsx";
import { useRef } from "react";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useCancelProcess } from "../../hooks/useBackTo.jsx";
import useDeviceId from "../../hooks/useDeviceId.jsx";
import useMetodoPost from "../../hooks/useMetodosPost.jsx";
import useAlert from "../../hooks/useAlert.jsx";
import { ENDPOINTS } from "../../repository/endpoints.js";
import CustomAlertModal from "../../components/CustomAlertModal.jsx";
import ProcessingModal from "../../components/ProcessingModal.jsx";
import alertError from "../../hooks/useAlertError.jsx";
import { KeyContext } from "../../contexts/KeyContext.js";
import { hide } from "expo-splash-screen";

export default function ForgotPwd({ route }) {
  // * FUNCTIONS
  useCancelProcess(route.params.backTo);
  const backTo = useState(route.params.backTo);
  const [campos, setCampos] = useState(null);
  // * FUNCTIONS
  // ? REFER
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  // ? REFER
  const device_id = useDeviceId();
  // ? FORMULARIO
  const { formValues, errors, handleChange, validateForm, reset } = useForm({
    cardNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // ? FORMULARIO
  // ? METODO POST
  const { request2 } = useMetodoPost();
  const { visible, hideAlert, showAlert } = useAlert();
  const { navigateTo } = useNavigateTo();
  const [loading, setLoading] = useState(false);
  const [errorMoji, setErrorMoji] = useState("");
  const [error, setError] = useState("");
  const [resetCard, setResetCard] = useState(false);

  const { setKeyByCard } = useContext(KeyContext);

  // ? METODO POST

  const resetCardNumber = () => {
    setResetCard(true);
    setTimeout(() => {
      setResetCard(false);
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
          tokenCard: formValues.cardNumber.replace(/\s+/g, ""),
          correo: formValues.email,
          password: formValues.password,
          deviceId: device_id,
        };
        if (backTo == "SignIn") {
          setKeyByCard(body.tokenCard);
        }
        const response = await request2("POST", body, ENDPOINTS.SOLCONTRA);
        reset();
        resetCardNumber();
        hideAlert();
        setLoading(false);
        navigateTo("AuthCode", {
          backTo: route.params.backTo,
          tipoFlujo: "RESCONTRA",
          tipoReenvio: "RECUPERAR",
          campos: body,
          goTo: route.params.backTo,
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
    <BackgroundCustom backTo={route.params.backTo}>
      {/* CONTAINER */}
      {/* TITULO */}
      <TitileContainer estilos={{ fontSize: 18 }}>
        Restablecer Contraseña
      </TitileContainer>
      {/* TITULO */}
      {/* FORM */}
      <ScrollView>
        <CardNumberInput
          nextRef={emailRef}
          onChangeText={(value) => handleChange("cardNumber", value)}
          error={errors.cardNumber}
          resetValue={resetCard}
        />
        <Input
          placeholder={"Email"}
          icon={faEnvelope}
          ref={emailRef}
          nextRef={passwordRef}
          onChangeText={(value) => handleChange("email", value.toLowerCase())}
          value={formValues.email}
          error={errors.email}
        />

        <Input
          icon={faLock}
          placeholder={"Contraseña"}
          min={10}
          ref={passwordRef}
          nextRef={confirmPasswordRef}
          secureTextEntry={true}
          onChangeText={(value) => handleChange("password", value)}
          value={formValues.password}
          error={errors.password}
        />

        <Input
          icon={faLock}
          placeholder={"Confirmar contraseña"}
          min={10}
          secureTextEntry={true}
          ref={confirmPasswordRef}
          returnKeyType={"done"}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          value={formValues.confirmPassword}
          error={errors.confirmPassword}
        />
        <View style={styles.BtnContainer}>
          <Buttons
            bgColor={Colors.AzulCopay}
            txtColor="white"
            tittle="Continuar"
            btnWidth="100%"
            evento={handleSubmit}
          />
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
}

const styles = StyleSheet.create({
  BtnContainer: {
    marginTop: 30,
    paddingHorizontal: 15,
  },
});
