import React, { useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  BackHandler,
} from "react-native";
import TitileContainer from "../../../components/TitileContainer";
import CustomAlertModal from "../../../components/CustomAlertModal.jsx";
import SuccessModal from "../../../components/SuccessModal.jsx";
import ProcessingModal from "../../../components/ProcessingModal.jsx";
import FormTransfer from "./FormTransfer";
import PasswordForm from "./PasswordForm";
import { useForm } from "../../../hooks/useForm.jsx";
import { BalanceContext } from "../../../contexts/BalanceContext.js";
import useAlert from "../../../hooks/useAlert.jsx";
import useMetodoPost from "../../../hooks/useMetodosPost.jsx";
import colors from "../../../../assets/styles/colors";
import style from "../../../../assets/styles/style.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons/faBuildingColumns";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ENDPOINTS } from "../../../repository/endpoints.js";
import ComprobanteSkia from "./ComprobanteSkia.jsx";
import { useNavigateTo } from "../../../hooks/usualFunctions.jsx";
import { hide } from "expo-splash-screen";
import { alertCancel, useBackTo } from "../../../hooks/useBackTo.jsx";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function Transfer({ navigation }) {
  const { navigateTo } = useNavigateTo();

  const continuar = () => {
    navigateTo("FormTransferScreen");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type !== "NAVIGATE") {
        e.preventDefault(); // Previene la navegación
      }
      if (e.data.action.type === "GO_BACK") {
        navigation.navigate("User");
      }
      if (e.data.action.type === "POP") {
        alertCancel(() => {
          navigation.getParent()?.navigate("SignInAuth");
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[style.safeAreaView, styles.container]}>
      <ScrollView style={styles.contenido}>
        <TitileContainer>TRANSFERIR</TitileContainer>
        <Text style={styles.labelform}>
          Ahora puedes transferir entre cuentas de la misma institución.
        </Text>
        <TouchableOpacity activeOpacity={0.2} onPress={continuar}>
          <View style={styles.btnTransferir}>
            <FontAwesomeIcon
              icon={faBuildingColumns}
              color={colors.AzulCopay}></FontAwesomeIcon>
            <Text style={[styles.txtTransferir]}>
              A cuenta o tarjeta Copayment
            </Text>
            <FontAwesomeIcon
              icon={faAngleRight}
              color={colors.AzulCopay}></FontAwesomeIcon>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.AzulCopay,
  },
  contenido: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    textAlign: "justify",
    backgroundColor: "#FAFAFA",
    flex: 1,
  },
  labelform: {
    fontFamily: "RobotoReg",
    fontSize: 13,
    letterSpacing: 1,
    paddingLeft: 15,
  },
  btnTransferir: {
    marginVertical: 20,
    paddingVertical: 25,
    paddingLeft: 15,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 0.2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  txtTransferir: {
    backgroundColor: "transaparent",
    fontSize: 13,
    fontFamily: "MontBold",
    fontWeight: "500",
    color: colors.AzulCopay,
  },
});
