import React, { useContext, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { CardNumberInput, InputImporte } from "../../../components/InputsForm";
import Buttons from "../../../components/Buttons";
import colors from "../../../../assets/styles/colors";
import {
  faArrowLeft,
  faChevronLeft,
  faCircleChevronLeft,
  faDollar,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigateTo } from "../../../hooks/usualFunctions";
import { useBackTo } from "../../../hooks/useBackTo";
import { BalanceContext } from "../../../contexts/BalanceContext";
import { useForm } from "../../../hooks/useForm";
import { useNavigation } from "@react-navigation/native";

export default function FormTransfer() {
  const navigation = useNavigation();
  const { navigateTo } = useNavigateTo();
  const { balance } = useContext(BalanceContext);
  // ? FORMULARIO
  const { formValues, errors, handleChange, validateForm, reset } = useForm({
    cardNumberTransfer: "",
    importe: "",
    saldoDisponible: balance,
    passwordnip: "",
  });
  useEffect(() => {
    if (balance) {
      handleChange("saldoDisponible", balance);
    }
  }, []);

  const continuar = () => {
    if (validateForm()) {
      navigateTo("PasswordScreen", { formValues: formValues });
    }
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
          <Text style={styles.tittle}>TRANSFERIR</Text>
        </View>
        <ScrollView
          style={{
            marginTop: 20,
          }}
          contentContainerStyle={{ paddingTop: 40 }}>
          <Text style={styles.label}>Destinatario:</Text>
          <CardNumberInput
            onChangeText={(value) => handleChange("cardNumberTransfer", value)}
            returnKeyType="done"
            error={errors?.cardNumberTransfer ? errors.cardNumberTransfer : ""}
          />
          <Text style={[styles.label, { marginTop: 15 }]}>Importe:</Text>
          <InputImporte
            icon={faDollar}
            placeholder="0.00"
            onChangeText={(value) => handleChange("importe", value)}
            error={errors?.importe ? errors.importe : ""}
          />
          <View style={{ marginTop: 35 }}>
            <Buttons
              bgColor={colors.AzulCopay}
              txtColor="white"
              tittle="Continuar"
              btnWidth="90%"
              evento={continuar}
            />
          </View>
        </ScrollView>
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
  },
  label: {
    fontFamily: "RobotoReg",
    fontSize: 13,
    letterSpacing: 1,
    paddingLeft: 15,
  },
  tittle: {
    fontSize: 20,
    fontFamily: "MontReg",
    textAlign: "center",
    flex: 1,
  },
  viewEncabezado: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 5,
  },
});
