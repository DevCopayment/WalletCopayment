import React, { useContext, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Alert,
  Text,
  ScrollView,
} from "react-native";
import { faLock, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Buttons from "../../components/Buttons.jsx";
import Colors from "../../../assets/styles/colors.js";
import BackgroundCustom from "../../components/BackgroundCustom.jsx";
import {
  Input,
  CheckBox,
  CardNumberInput,
} from "../../components/InputsForm.jsx";
import { useForm } from "../../hooks/useForm.jsx";
import TitileContainer from "../../components/TitileContainer.jsx";
import { URL_AVISOP } from "@env";
import { ENDPOINTS } from "../../repository/endpoints.js";
import useMetodoPost from "../../hooks/useMetodosPost.jsx";
import useDeviceId from "../../hooks/useDeviceId.jsx";
import { useNavigateTo } from "../../hooks/usualFunctions.jsx";
import { useBackTo } from "../../hooks/useBackTo.jsx";
import CustomAlertModal from "../../components/CustomAlertModal.jsx";
import useAlert from "../../hooks/useAlert.jsx";
import ProcessingModal from "../../components/ProcessingModal.jsx";
import colors from "../../../assets/styles/colors.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { KeyContext, KeyProvider } from "../../contexts/KeyContext.js";
const SignUp = () => {
  // * FUNCTIONS
  useBackTo("Indice");
  // * FUNCTIONS
  // ? REFER
  const emailRef = useRef();
  const celularRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  // ? REFER

  // ? NAVEGACION HACIA ATRAS
  const [errorAlert, setErrorAlert] = useState("");
  const [errorMoji, setErrorMoji] = useState("");
  const [campos, setCampos] = useState("");

  // ? FORMULARIO
  const { formValues, errors, handleChange, validateForm, reset } = useForm({
    cardNumber: "",
    email: "",
    celular: "",
    password: "",
    confirmPassword: "",
    terminos: false,
  });
  // ? FORMULARIO

  // ? METODO POST
  const { loading, request2 } = useMetodoPost();
  const { visible, hideAlert, showAlert } = useAlert();
  const { navigateTo } = useNavigateTo();
  const [resetCard, setResetCard] = useState(false); // Control para resetear el input
  const { setKeyByCard } = useContext(KeyContext);
  // ? METODO POST

  const device_id = useDeviceId();

  const handleSubmit = async () => {
    hideAlert();
    try {
      if (validateForm()) {
        const body = {
          tokenCard: formValues.cardNumber.replace(/\s+/g, ""),
          correo: formValues.email,
          telefono: formValues.celular,
          codigo: "",
          password: formValues.password,
          deviceId: device_id,
        }; // Cuerpo de la solicitud POST

        setCampos(body);
        setKeyByCard(body.tokenCard);
        const preregistroResponse = await request2(
          "POST",
          body,
          ENDPOINTS.PREREGISTRO
        );

        navigateTo("AuthCode", {
          backTo: "Indice",
          tipoFlujo: "REGISTRO",
          tipoReenvio: "PREREGISTRO",
          campos: body,
          goTo: "User",
        });
      }
    } catch (error) {
      setErrorAlert(
        error?.message
          ? error.message
          : "Sistema no disponible por el momento. Intente de nuevo más tarde."
      );
      setErrorMoji(error?.emoji ? error.emoji : "⚠️");
      showAlert();
    }
  };

  const linkPrivacidadOpen = () => {
    Alert.alert(
      "¿Quieres continuar?",
      "Al abrir el aviso de privacidad, saldrás de la aplicación y se abrirá en tu navegador.",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Abrir",
          onPress: () => {
            Linking.openURL(URL_AVISOP).catch((err) =>
              linkPrivacidadError(err)
            );
          },
        },
      ]
    );
  };

  const linkPrivacidadError = (err) => {
    Alert.alert("⚠️", "Hubo un problema al abrir el enlace.", [
      {
        text: "Ok",
      },
    ]);
  };
  const resetCardNumber = () => {
    setResetCard(true); // Activamos el reset
    setTimeout(() => {
      setResetCard(false); // Desactivamos el reset después de un ciclo para evitar resets repetidos inmediatos
    }, 0);
  };

  return (
    <BackgroundCustom backTo={"Indice"}>
      {/* CONTAINER */}
      {/* TITULO */}
      <TitileContainer>Registro</TitileContainer>
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
        />
        <Input
          placeholder={"Email"}
          icon={faEnvelope}
          ref={emailRef}
          nextRef={celularRef}
          onChangeText={(value) => handleChange("email", value.toLowerCase())}
          value={formValues.email}
          error={errors.email}
        />
        <Input
          placeholder={"Número de celular"}
          icon={faPhone}
          inputMode={"numeric"}
          ref={celularRef}
          nextRef={passwordRef}
          onChangeText={(value) => handleChange("celular", value)}
          value={formValues.celular}
          error={errors.celular}
          maxLength={10}
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
        <CheckBox
          evento={() => linkPrivacidadOpen()}
          isChecked={formValues.terminos}
          onPress={(value) => handleChange("terminos", value)}
          error={errors.terminos}
          text={"Acepto el aviso de privacidad."}
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            padding: 15,
          }}>
          <Text style={styles.LeyendaInicio}>¿Ya tienes cuenta?</Text>
          <Text
            onPress={() => {
              reset(), resetCardNumber(), navigateTo("SignIn");
            }}
            style={[
              styles.LeyendaInicio,
              { color: colors.AzulCopay, paddingLeft: 5, fontWeight: "500" },
            ]}>
            Inicia sesión aqui.
          </Text>
        </View>
        <CustomAlertModal
          visible={visible}
          onClose={hideAlert}
          icon={errorMoji}
          message={errorAlert}
        />
        <ProcessingModal visible={loading} />
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

export default SignUp;
