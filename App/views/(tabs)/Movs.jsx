import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Movimientos from "../../components/Movimientos";
import { useBackTo } from "../../hooks/useBackTo";
import useMetodoPost from "../../hooks/useMetodosPost";
import useAlert from "../../hooks/useAlert";
import { ENDPOINTS } from "../../repository/endpoints";
import CustomAlertModal from "../../components/CustomAlertModal";
import ProcessingModal from "../../components/ProcessingModal";
import alertError from "../../hooks/useAlertError.jsx";

export default function Movs() {
  const [movimientos, setMovimientos] = useState([]);
  // ? METODO POST
  const { request2 } = useMetodoPost();
  const { visible, hideAlert, showAlert } = useAlert();
  const [alertErrorMsg, setAlertError] = useState("");
  const [errorMoji, setErrorMoji] = useState("");
  const [loading, setLoading] = useState(false);

  // ? METODO POST

  async function Movs() {
    hideAlert();
    setAlertError("");
    try {
      setLoading(true);
      showAlert();
      const body = {
        type: "0",
        start: "0",
        offset: "100",
      };

      const response = await request2("POST", body, ENDPOINTS.MOVS);
      if (
        !response.transactions ||
        Object.keys(response.transactions).length === 0
      ) {
        setMovimientos([]);
      } else {
        setMovimientos(response.transactions);
      }
      hideAlert();
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
  }
  useEffect(() => {
    Movs();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Movimientos transactions={movimientos}></Movimientos>
        {movimientos.length === 0 ? (
          <View>
            <Text style={styles.txtVerMas}>No se encontraron movimientos.</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.txtVerMas}>
              Mostrando el historial de los últimos 60 días
            </Text>
          </View>
        )}
        <CustomAlertModal
          visible={visible}
          onClose={hideAlert}
          icon={errorMoji}
          message={alertErrorMsg}
          loading={loading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  txtVerMas: {
    fontSize: 10,
    textAlign: "center",
    fontFamily: "RobotoLight",
    letterSpacing: 1.5,
    paddingBottom: 10,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});
