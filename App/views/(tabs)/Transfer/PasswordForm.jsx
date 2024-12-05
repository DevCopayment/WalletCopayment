import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import {
  CardNumberInput,
  InputImportes,
  InputPass,
} from "../../../components/InputsForm";
import Buttons from "../../../components/Buttons";
import colors from "../../../../assets/styles/colors";
import { faArrowLeft, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useForm } from "../../../hooks/useForm";
import { useNavigateTo } from "../../../hooks/usualFunctions";
import { alertCancel } from "../../../hooks/useBackTo";
import { useNavigation } from "@react-navigation/native";
import useMetodoPost from "../../../hooks/useMetodosPost";
import useAlert from "../../../hooks/useAlert";
import CustomAlertModal from "../../../components/CustomAlertModal";
import { ENDPOINTS } from "../../../repository/endpoints";

export default function PasswordForm({ route }) {
  const { navigateTo } = useNavigateTo();
  const navigation = useNavigation();
  const { formValues, errors, handleChange, validateForm, reset } = useForm({
    passwordnip: "",
  });
  const { request2 } = useMetodoPost();
  const { visible, hideAlert, hideAlertBack, showAlert, hideAlertBackScreen } =
    useAlert();
  const [alertError, setAlertError] = useState("");
  const [emoji, setEmoji] = useState("");
  const [loading, setLoading] = useState(false);
  const formatCurrency = (value, locale = "es-MX", currency = "MXN") => {
    if (isNaN(value) || value === null || value === undefined || value === "") {
      return value; // Valor por defecto
    }

    // Formatear la moneda
    const formattedValue = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);

    // Insertar un espacio extra entre el símbolo y el número
    return formattedValue.replace(/(\$\s?)/, "$1 "); // Asegura un espacio después del símbolo
  };

  async function traspaso() {
    hideAlert();
    setAlertError("");
    try {
      if (formValues.passwordnip) {
        setLoading(true);
        showAlert();
        const body = {
          importe: route.params.formValues.importe,
          cardNumber: route.params.formValues.cardNumberTransfer.replace(
            /\s+/g,
            ""
          ),
          password: formValues.passwordnip,
        };
        const response = await request2("POST", body, ENDPOINTS.TRANSFER);
        hideAlert();
        navigateTo("Comprobante", {
          info: response,
        });
      }
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

  const cancelar = () => {
    Alert.alert(
      "Cancelar Transacción", // Título de la alerta
      "¿Estás seguro de que deseas cancelar la transacción?", // Mensaje de la alerta
      [
        {
          text: "No", // Botón de cancelar
          style: "cancel",
        },
        {
          text: "Sí", // Botón de confirmación
          onPress: () => {
            reset();
            navigation.navigate("MyTabs", { screen: "Transferir" });
            // Lógica adicional para cancelar la transacción
          },
        },
      ],
      { cancelable: false } // Evita que se cierre la alerta tocando fuera de ella
    );
  };
  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <View style={styles.viewEncabezado}>
          <TouchableOpacity
            style={{ alignItems: "flex-start" }}
            onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faChevronLeft} size={20}></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}>
          <Text style={styles.tittle} adjustsFontSizeToFit numberOfLines={1}>
            Enviar
          </Text>
          <Text
            style={[
              styles.tittle,
              {
                color: colors.Cyan,
                fontFamily: "MontReg",
                marginHorizontal: 4,
                flexShrink: 1,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {formatCurrency(route.params.formValues.importe)}
          </Text>
          <Text style={styles.tittle}> a </Text>
        </View>
        <Text
          style={[
            styles.tittle,
            {
              color: colors.AzulCopay,
              fontFamily: "MontReg",
              textAlign: "center",
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          **** **** **** {route.params.formValues.cardNumberTransfer.slice(-4)}
        </Text>
        <View style={{ marginTop: 50 }}>
          <Text style={styles.label}>Ingresa tu contraseña:</Text>

          <InputPass
            textAlign={"center"}
            letterSpacing={2}
            color={"black"}
            returnKeyType="done"
            fontSize={12}
            onChangeText={(value) => handleChange("passwordnip", value)}
          />
        </View>
        <View
          style={[
            styles.BtnContainer,
            {
              paddingHorizontal: 15,
              paddingTop: 15,
            },
          ]}>
          <Buttons
            bgColor={colors.AzulCopay}
            txtColor="white"
            tittle="Transferir"
            btnWidth="100%"
            textStylesCustom={{ fontSize: 18 }}
            evento={traspaso}
          />
        </View>
        <View
          style={[
            styles.BtnContainer,
            {
              paddingHorizontal: 15,
            },
          ]}>
          <Buttons
            bgColor={"gray"}
            txtColor="white"
            tittle="Cancelar"
            btnWidth="100%"
            textStylesCustom={{ fontSize: 18 }}
            evento={cancelar}
          />
        </View>
        <CustomAlertModal
          visible={visible}
          onClose={() => hideAlertBackScreen("MyTabs", "Transferir")}
          icon={emoji}
          message={alertError}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: 30,
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 40,
    flex: 1,
    // justifyContent: "center",
  },
  label: {
    fontFamily: "RobotoReg",
    fontSize: 13,
    letterSpacing: 1,
    paddingLeft: 15,
  },
  tittle: {
    fontSize: 25,
    fontFamily: "MontLight",
    // textAlign: "center",
  },
  viewEncabezado: {
    // alignItems: "center",}
    flexDirection: "row",
    paddingLeft: 5,
  },
  BtnContainer: {
    marginTop: 15,
  },
});
