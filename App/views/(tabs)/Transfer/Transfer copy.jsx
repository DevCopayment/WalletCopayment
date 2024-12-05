import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import colors from "../../../../assets/styles/colors.js";
import style from "../../../../assets/styles/style.jsx";
import TitileContainer from "../../../components/TitileContainer.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAngleRight,
  faBuildingColumns,
  faDollar,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import {
  CardNumberInput,
  InputImporte,
  InputPass,
} from "../../../components/InputsForm.jsx";
import Buttons from "../../../components/Buttons.jsx";
import Nip from "../Nip.jsx";
import { useForm } from "../../../hooks/useForm.jsx";
import { BalanceContext } from "../../../contexts/BalanceContext.js";
import { alertCancel } from "../../../hooks/useBackTo.jsx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useAlert from "../../../hooks/useAlert.jsx";
import useMetodoPost from "../../../hooks/useMetodosPost.jsx";
import { ENDPOINTS } from "../../../repository/endpoints.js";
import CustomAlertModal from "../../../components/CustomAlertModal.jsx";
import ProcessingModal from "../../../components/ProcessingModal.jsx";
import alertError from "../../../hooks/useAlertError.jsx";
import SuccessModal from "../../../components/SuccessModal.jsx";

const FormTransfer = (visible = false, setFormVisible, handleChange) => {
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.formContainer}>
        <View style={styles.formContenido}>
          <TouchableOpacity
            style={{ alignItems: "flex-end" }}
            onPress={() => setFormVisible(false)}>
            <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
          </TouchableOpacity>

          <KeyboardAwareScrollView>
            <Text style={styles.labelform}>Destinatario:</Text>
            <CardNumberInput
              onChangeText={(value) =>
                handleChange("cardNumberTransfer", value)
              }
              error={errors.cardNumberTransfer}></CardNumberInput>
            <Text style={[styles.labelform, { marginTop: 15 }]}>Importe:</Text>

            <InputImporte
              icon={faDollar}
              inputMode="numeric"
              estilos={{ fontSize: 19, fontFamily: "MontReg" }}
              placeholder={"0.00"}
              onChangeText={(value) => handleChange("importe", value)}
              error={errors.importe}></InputImporte>

            <View style={styles.BtnContainer}>
              <Buttons
                bgColor={colors.AzulCopay}
                txtColor="white"
                tittle="Continuar"
                btnWidth="90%"
                evento={() => continuarTransferir()}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function Transfer() {
  const [formVisible, setFormVisible] = useState(false);
  const [passFormVisible, setPassFormVisible] = useState(false);
  const [tokenAuth, setTokenAuth] = useState(false);

  const { balance } = useContext(BalanceContext);
  // ? FORMULARIO
  const { formValues, errors, handleChange, validateForm, reset } = useForm({
    cardNumberTransfer: "",
    importe: "",
    saldoDisponible: balance,
    passwordnip: "",
  });
  // ? FORMULARIO

  // ? METODO POST
  const { data, loading, error, errorMoji, request, response } =
    useMetodoPost();
  const { visible, hideAlert, showAlert } = useAlert();
  const [alertErrorMsg, setAlertError] = useState(null);
  const [successVisible, setSuccesVisible] = useState(false);
  const [mensajeSucces, setMensajeSucces] = useState("");
  // ? METODO POST
  // ! ERROR MANEJO
  useEffect(() => {
    if (error) {
      setAlertError(error);
      showAlert();
    }
  }, [error]);
  // !  BALANCE
  useEffect(() => {
    if (balance) {
      handleChange("saldoDisponible", balance);
    }
  }, []);
  // ! BALANCE
  useEffect(() => {
    if (response?.data?.responseCode === "00") {
      setMensajeSucces("Transferencia exitosa");
      setSuccesVisible(true);

      timer = setTimeout(() => {
        setSuccesVisible(false);
      }, 3000);
    }
  }, [response]);

  async function Transferencia() {
    setAlertError(null);
    hideAlert();
    try {
      if (formValues.passwordnip) {
        const body = {
          importe: formValues.importe,
          cardNumber: "5063450500025283",
          // cardNumber: formValues.cardNumberTransfer.replace(/\s+/g, ""),
          password: formValues.passwordnip,
        };
        reset();
        setPassFormVisible(false);
        await request("POST", body, ENDPOINTS.TRANSFER);
      }
    } catch (error) {
      alertError();
    }
  }
  function transferirForm() {
    setFormVisible(true);
  }
  function continuarTransferir() {
    if (validateForm()) {
      setPassFormVisible(true);
      setFormVisible(false);
    }
  }
  const cancelarTransfer = () => {
    setPassFormVisible(false);
  };

  return (
    <View style={[style.safeAreaView, styles.container]}>
      <View style={styles.contenido}>
        <TitileContainer>TRANSFERIR</TitileContainer>
        <Text
          style={{
            textAlign: "justify",
            fontFamily: "RobotoReg",
            fontSize: 13,
          }}>
          Ahora puedes transferir entre cuentas de la misma institución.
        </Text>
        <TouchableOpacity activeOpacity={0.2} onPress={() => transferirForm()}>
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
        {/* FORM PASSWORD */}
        <Modal transparent={true} visible={passFormVisible}>
          <View style={styles.formContainer}>
            <View style={styles.formContenido}>
              <Text style={styles.labelform}>Ingresa tu contraseña:</Text>

              <View style={{ marginHorizontal: 50, marginTop: 10 }}>
                {/* <InputCode
                  length={4}
                  style={{ fontSize: 55 }}
                  onChangeCode={(value) =>
                    handleChange("codigoNip", value)
                  }></InputCode> */}
                <InputPass
                  textAlign={"center"}
                  letterSpacing={2}
                  color={"black"}
                  fontSize={15}
                  onChangeText={(value) => handleChange("passwordnip", value)}
                />
              </View>
              <View
                style={[
                  styles.BtnContainer,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 15,
                    paddingTop: 10,
                  },
                ]}>
                <View style={{ flex: 1 }}>
                  <Buttons
                    bgColor={"gray"}
                    txtColor="white"
                    tittle="Cancelar"
                    btnWidth="100%"
                    textStylesCustom={{ fontSize: 15 }}
                    evento={() => alertCancel(cancelarTransfer)}
                  />
                </View>
                <View style={{ flex: 1, marginHorizontal: 5 }}>
                  <Buttons
                    bgColor={colors.AzulCopay}
                    txtColor="white"
                    tittle="Aceptar"
                    btnWidth="100%"
                    textStylesCustom={{ fontSize: 15 }}
                    evento={() => Transferencia()}
                  />
                </View>
              </View>
              <View style={{ marginTop: 10 }}></View>
            </View>
          </View>
        </Modal>
        {/* FORM TRANSFERENCIA */}

        {/* TOKENAUTH */}
        <Modal transparent={true} visible={false}>
          <Nip traspaso={setTokenAuth}></Nip>
        </Modal>
        <CustomAlertModal
          visible={visible}
          onClose={hideAlert}
          icon={errorMoji}
          message={error}
        />
        <SuccessModal
          // onClose={() => setSuccesVisible(false)}
          visible={successVisible}
          message={mensajeSucces}

          // duration={5000} // Duración de 5 segundos antes de cerrar el modal
        />
        <ProcessingModal visible={loading}></ProcessingModal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    // borderBottomColor: colors.AzulCopay,
    // borderBottomWidth: 1,
  },
  BtnContainer: {
    marginTop: 25,
  },
  contenido: {
    margin: 15,
    paddingHorizontal: 10,
    textAlign: "justify",
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
    // elevation: 0.1,
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
  formContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  formContenido: {
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 40,
    height: "100%",
  },
});
