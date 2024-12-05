import {
  StyleSheet,
  Text,
  View,
  Animated,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import style from "../../../assets/styles/style";
import TitileContainer from "../../components/TitileContainer";
import { Input } from "../../components/InputsForm";
import Buttons from "../../components/Buttons";
import colors from "../../../assets/styles/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import alertError from "../../hooks/useAlertError";
import useAlert from "../../hooks/useAlert";
import { useForm } from "../../hooks/useForm";
import useMetodoPost from "../../hooks/useMetodosPost";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { ENDPOINTS } from "../../repository/endpoints";
import CustomAlertModal from "../../components/CustomAlertModal";
import ProcessingModal from "../../components/ProcessingModal";
import decryptNIP from "../../Jwe/DesNip";
import { useBackTo } from "../../hooks/useBackTo";

export default function Nip({ timeNip }) {
  const navigation = useNavigation();

  const [isSuccess, setIsSuccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState(10); // Tiempo total de visualización (por defecto 10)
  const [progress] = useState(new Animated.Value(1)); // Progreso inicial
  const [inputTime, setInputTime] = useState(timeNip); // Tiempo de visualización ingresado por el usuario
  // Reiniciar la página cuando la pantalla pierde foco
  const [nip, setNip] = useState("");
  const [loading, setLoading] = useState(false);

  // ? METODO POST
  const { request2 } = useMetodoPost();
  const { visible, hideAlert, showAlert } = useAlert();
  const [alertErrorMsg, setAlertError] = useState("");
  const [emoji, setEmoji] = useState("");

  // ? METODO POST
  // ? FORMULARIO
  const { formValues, errors, handleChange, validateForm, reset } = useForm({
    pass: "",
  });
  // ? FORMULARIO
  const handleDecrypt = async (encryptedNIP) => {
    const decryptedNIP = decryptNIP(encryptedNIP);
    setNip(decryptedNIP); // Actualiza el estado con el NIP desencriptado
  };

  // ! ERROR MANEJO

  // ! ERROR MANEJO
  // ! RESPONSE

  const consultaNip = async () => {
    hideAlert();
    setAlertError("");

    if (formValues.pass) {
      try {
        const body = {
          password: formValues.pass,
        };
        reset();
        setLoading(true);
        showAlert();
        const response = await request2("POST", body, ENDPOINTS.NIP);
        handleDecrypt(response.nip);
        setRemainingTime(Number(inputTime));
        hideAlert();
        setIsSuccess(true);
      } catch (error) {
        hideAlert();
        setLoading(false);
        setAlertError(
          error?.message
            ? error.message
            : "Sistema no disponible por el momento. Intente de nuevo más tarde."
        );
        setEmoji(error?.emoji ? error.emoji : "⚠️");
        showAlert();
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsSuccess(false); // Asegúrate de reiniciar el estado aquí
      setRemainingTime(Number(inputTime)); // Reiniciar al tiempo ingresado
      progress.setValue(1); // Reiniciar el progreso

      return () => {
        setIsSuccess(false);
        setNip(""); // Limpiar el estado al salir
      };
    }, [inputTime])
  );

  useEffect(() => {
    let timer;

    if (isSuccess && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      // Actualiza la barra de progreso en función del tiempo restante
      Animated.timing(progress, {
        toValue: remainingTime / Number(inputTime), // Calcular el valor de progreso basado en el tiempo restante
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }

    if (remainingTime === 0) {
      clearInterval(timer);
      setIsSuccess(false); // Ocultar el NIP después de que se complete el tiempo
      setRemainingTime(Number(inputTime)); // Resetear el tiempo
      progress.setValue(1); // Reiniciar el progreso
    }

    return () => clearInterval(timer); // Limpiar el intervalo al desmontar
  }, [isSuccess, remainingTime, inputTime]);

  return (
    <View style={[style.safeAreaView, styles.container]}>
      <View style={{ flex: 1, backgroundColor: "#FAFAFA", paddingTop: 20 }}>
        <TitileContainer>CONSULTAR NIP</TitileContainer>

        <View style={{ flex: 1 }}>
          {isSuccess ? (
            <View style={styles.nipContainer}>
              <Text style={{ color: "white" }}>Este es tu NIP:</Text>
              <Text style={styles.nipText}>{nip}</Text>
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={{
                    ...styles.progressBar,
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["100%", "0%"],
                    }),
                  }}
                />
              </View>
              <Text style={styles.countdownText}>
                Tiempo restante: {remainingTime} segundos
              </Text>
            </View>
          ) : (
            <View style={{ paddingTop: 20, paddingHorizontal: 40 }}>
              <Text
                style={[
                  { fontFamily: "RobotoReg", fontSize: 13, marginLeft: 10 },
                ]}>
                Ingresa tu contraseña:
              </Text>
              <View style={{}}>
                <Input
                  icon={faLock}
                  // textAlign={"center"}
                  secureTextEntry={true}
                  value={formValues.pass}
                  letterSpacing={2}
                  color={"black"}
                  fontSize={15}
                  onChangeText={(value) => handleChange("pass", value)}
                />
              </View>
              <View style={styles.btnContainer}>
                <Buttons
                  textStylesCustom={{ fontSize: 15, paddingVertical: 10 }}
                  btnWidth="100%"
                  bgColor={colors.AzulCopay}
                  txtColor="white"
                  tittle="Aceptar"
                  evento={consultaNip}
                />
              </View>
            </View>
          )}
        </View>

        <CustomAlertModal
          icon={emoji}
          message={alertErrorMsg}
          onClose={hideAlert}
          visible={visible}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.AzulCopay,
    // alignContent: "center",
    // textAlign: "center",
    // paddingHorizontal: 15,
    // paddingTop: 50,
    // borderBottomWidth: 1,
  },
  textLeyenda: {
    fontSize: 12,
    fontFamily: "RobotoReg",
    paddingHorizontal: 15,
    textAlign: "center",
    marginVertical: 15,
  },
  btnContainer: {
    marginTop: 30,
    // marginBottom: 15,
    paddingHorizontal: 10,
  },
  nipContainer: {
    alignItems: "center",
    backgroundColor: colors.AzulCopay,
    borderRadius: 14,
    margin: 20,
    padding: 50,
  },
  nipText: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 10,
    color: "white",
  },
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0", // Color de fondo de la barra
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.Cyan, // Color de la barra de progreso
  },
  countdownText: {
    marginTop: 5,
    fontSize: 14,
    color: "white", // Color del texto del contador
  },
});
