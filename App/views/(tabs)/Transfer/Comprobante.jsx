import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import colors from "../../../../assets/styles/colors";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import LogoCopayment from "../../../../assets/images/logo_signin.png";

export default function Comprobante({ visible, setVisible, info }) {
  const viewShotRef = useRef();

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

  const [imageUri, setImageUri] = useState(null); // Estado para la imagen capturada

  const onCapture = async () => {
    const snapshot = skiaRef.current.makeImageSnapshot();
    const imageBase64 = snapshot.encodeToBase64(); // Convierte a base64
    const uri = `data:image/png;base64,${imageBase64}`; // URI en base64 para mostrarla
    setImageUri(uri); // Guarda la imagen en el estado
  };
  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <View style={styles.viewEncabezado}>
          <TouchableOpacity
            style={{ alignItems: "flex-start" }}
            onPress={setVisible}>
            <FontAwesomeIcon icon={faArrowLeft} size={20}></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
        <View ref={viewShotRef} style={styles.bg_imgContainer}>
          <Image style={styles.bg_img} source={LogoCopayment}></Image>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            paddingHorizontal: 20,
          }}>
          <Text style={styles.tittle}>
            dsinfoisnofidComprobante de transferencia
          </Text>
          <Text style={styles.label}>Concepto:</Text>
          <Text style={styles.label2}>TRASPASO</Text>
          <Text style={styles.label}>Origen:</Text>
          <Text style={styles.label2}>Tarjeta * {info.origen}</Text>
          <Text style={styles.label}>Destino:</Text>
          <Text style={styles.label2}>Tarjeta * {info.destino}</Text>
          <Text style={styles.label}>Monto: </Text>
          <Text style={styles.label2}>{formatCurrency(info.monto)}</Text>
          <Text style={styles.label}>Folio de operación:</Text>
          <Text style={styles.label2}>
            {info.folio.toString().padStart(6, "0")}
          </Text>
          <Text style={styles.label}>Fecha de operación:</Text>
          <Text style={styles.label2}>{info.fecha}</Text>
          <Text
            style={[
              styles.label,
              {
                fontFamily: "MontBold",
                textAlign: "right",
                fontSize: 12,
                paddingTop: 5,
                color: colors.AzulCopay,
              },
            ]}>
            Copayment de México S.A.P.I. de C.V
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 40,
    flex: 1,
    // justifyContent: "center",
  },
  label: {
    fontFamily: "RobotoBold",
    fontSize: 14,
    letterSpacing: 1,
    // paddingLeft: 15,
  },
  label2: {
    fontFamily: "RobotoReg",
    fontSize: 14,
    letterSpacing: 1,
    // paddingLeft: 15,
  },
  tittle: {
    fontSize: 20,
    fontFamily: "MontReg",
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
  bg_img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  bg_imgContainer: {
    width: "100%",
    height: "10%",
    // backgroundColor: "green",
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
