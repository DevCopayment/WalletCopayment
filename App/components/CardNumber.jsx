import {
  ImageBackground,
  StyleSheet,
  Switch,
  Text,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CardActive from "../../assets/images/cardbg.png";
import CardBlock from "../../assets/images/cardbyn.png";
import CardActiveV from "../../assets/images/cardbg_visa.png";
import CardBlockV from "../../assets/images/cardbg_visaBN.png";
import Carnet from "../../assets/images/Carnet.png";
import Visa from "../../assets/images/visa.png";
import { KeyContext } from "../contexts/KeyContext";
import { useSVG } from "@shopify/react-native-skia";
import colors from "../../assets/styles/colors";

const CardNumber = ({ balance, masked, statusCard, onChangeStatusCard }) => {
  const { getAmbiente } = useContext(KeyContext);
  const [ambiente, setAmbiente] = useState("carnet");

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
  const alertPrev = (value) => {
    Alert.alert(
      "Cambio de Estado de la Tarjeta",
      "¿Deseas " + (value ? "activar" : "bloquear") + " tu tarjeta?",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Aceptar",
          onPress: () => onChangeStatusCard(value), // Llama al callback si el usuario acepta
        },
      ]
    );
  };
  useEffect(() => {
    const obtener = async () => {
      const am = await getAmbiente();
      setAmbiente(am);
    };
    obtener();
  }, [ambiente]);

  return (
    <View style={{}}>
      {ambiente == "carnet" ? (
        <ImageBackground
          source={statusCard ? CardActive : CardBlock}
          style={styles.cardBackground}
          imageStyle={{ borderRadius: 10 }}>
          <View style={styles.cardContent}>
            <View style={styles.switchContainer}>
              <Switch
                trackColor={{ false: "gray", true: "#C9D0CC" }}
                thumbColor={statusCard ? "#00acff" : "#f4f3f4"} // Cyan cuando activo
                ios_backgroundColor="gray"
                onValueChange={(value) => alertPrev(value)}
                value={statusCard}
              />
              <Text style={styles.switchText}>
                {statusCard ? "ACTIVA" : "BLOQUEADA"}
              </Text>
            </View>

            {/* Saldo */}
            <View style={styles.infoContainer}>
              <View style={styles.balanceBox}>
                <Text
                  style={styles.balanceText}
                  adjustsFontSizeToFit
                  numberOfLines={1}>
                  {formatCurrency(balance)}
                </Text>
                <Text style={styles.balanceLabel}>Saldo disponible</Text>
              </View>
            </View>

            {/* Últimos Dígitos y Ícono de la Tarjeta */}
            <View style={styles.bottomContainer}>
              <Text style={styles.cardDigits}> ° {masked}</Text>
              <Image source={Carnet} style={styles.cardIcon} />
            </View>
          </View>
        </ImageBackground>
      ) : (
        <ImageBackground
          source={statusCard ? CardActiveV : CardBlockV}
          style={styles.cardBackground}
          imageStyle={{ borderRadius: 10 }}>
          <View style={[styles.cardContent, { paddingTop: 10 }]}>
            <View
              style={[styles.switchContainer, { justifyContent: "flex-end" }]}>
              <Text
                style={[
                  styles.switchText,
                  {
                    color: statusCard ? colors.AzulCopay : "black",
                    fontFamily: "MontBold",
                    fontSize: 10,
                    marginRight: 12,
                  },
                ]}>
                {statusCard ? "ACTIVA" : "BLOQUEADA"}
              </Text>
              <Switch
                trackColor={{ false: "gray", true: "#C9D0CC" }}
                thumbColor={statusCard ? colors.AzulCopay : "#f4f3f4"} // Cyan cuando activo
                ios_backgroundColor="white"
                onValueChange={(value) => alertPrev(value)}
                value={statusCard}
              />
            </View>

            {/* Saldo */}
            <View style={styles.infoContainer}>
              <View style={styles.balanceBox}>
                <Text
                  style={styles.balanceText}
                  adjustsFontSizeToFit
                  numberOfLines={1}>
                  {formatCurrency(balance)}
                </Text>
                <Text style={styles.balanceLabel}>Saldo disponible</Text>
              </View>
            </View>

            {/* Últimos Dígitos y Ícono de la Tarjeta */}
            <View style={styles.bottomContainer}>
              <Text
                style={[
                  styles.cardDigits,
                  { color: colors.AzulCopay, fontFamily: "MontBold" },
                ]}>
                {" "}
                ° {masked}
              </Text>
            </View>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardBackground: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
    padding: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  switchText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "MontLight",
    letterSpacing: 1,
    color: "#fff",
    marginLeft: 10,
  },
  infoContainer: {
    position: "absolute",
    top: "40%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  balanceBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  balanceText: {
    fontSize: 24,
    color: "black",
    fontFamily: "MontReg",
    maxWidth: 200,
  },
  balanceLabel: {
    fontSize: 10,
    color: "rgba(61, 62, 64)",
    marginTop: 5,
    fontFamily: "MontReg",
    fontWeight: "700",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardDigits: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "MontBold",

    letterSpacing: 2,
    textAlign: "center",
  },
  cardIcon: {
    width: 50,
    height: 30,
    tintColor: "#fff",
  },
});
export default CardNumber;
