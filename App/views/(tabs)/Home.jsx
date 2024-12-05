import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import React, { useCallback, useState, useContext, useEffect } from "react";
import style from "../../../assets/styles/style";
import bg_main from "../../../assets/images/bg_mainNogif.png";
import CardNumber from "../../components/CardNumber";
import { StatusBar } from "expo-status-bar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronCircleDown,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import Movimientos from "../../components/Movimientos";
import { useNavigateTo } from "../../hooks/usualFunctions.jsx";
import {
  alertCancel,
  useBackTo,
  useCancelProcess,
} from "../../hooks/useBackTo.jsx";
import useAlert from "../../hooks/useAlert.jsx";
import useMetodoPost from "../../hooks/useMetodosPost.jsx";
import { ENDPOINTS } from "../../repository/endpoints.js";
import { AuthContext } from "../../contexts/AuthContext.js";
import CustomAlertModal from "../../components/CustomAlertModal.jsx";
import ProcessingModal from "../../components/ProcessingModal.jsx";
import { BalanceContext } from "../../contexts/BalanceContext.js";
import colors from "../../../assets/styles/colors.js";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

const SectionCharges = ({ abonos, cargos }) => {
  const getMonthName = () => {
    const monthNames = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];
    const currentMonth = new Date().getMonth(); // Obtiene el mes actual (0-11)
    return monthNames[currentMonth];
  };
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
  return (
    <View style={styles.sectionCharges}>
      <Text style={styles.txtMes}>{getMonthName()}</Text>
      <View style={styles.chargesContainer}>
        {/* ABONOS */}
        <View style={styles.montoContainer}>
          <View style={{ margin: 5 }}>
            <FontAwesomeIcon
              icon={faChevronCircleUp}
              color="#00FFB3"
              size={30}
            />
          </View>
          <View style={{ margin: 5 }}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.txtmonto}>
              {formatCurrency(abonos)}
            </Text>
            <Text style={styles.txtLeyendaCharges}>Abonos</Text>
          </View>
        </View>
        {/* CARGOS */}
        <View style={styles.montoContainer}>
          <View style={{ margin: 5 }}>
            <FontAwesomeIcon
              icon={faChevronCircleDown}
              color="#FF6B6B"
              size={30}
            />
          </View>
          <View style={{ margin: 5 }}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.txtmonto}>
              {formatCurrency(cargos)}
            </Text>
            <Text style={styles.txtLeyendaCharges}>Cargos</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Home() {
  // useCancelProcess("User");
  const navigation = useNavigation();

  // ? VARIABLES
  const { navigateTo } = useNavigateTo();
  const { balance, setSaldo } = useContext(BalanceContext);
  const [walletData, setWalletData] = useState({
    balance: "",
    mask: "",
    statusCard: false,
    cargos: "---",
    abonos: "---",
    transactions: [],
  });
  const [loadingModal, setLoadingModal] = useState(false);
  const { getUserToken, noFirstTime } = useContext(AuthContext);
  const { request2 } = useMetodoPost();
  const [loadingMovs, setLoadingMovs] = useState(false);
  const { visible, hideAlert, showAlert } = useAlert();
  const [alertError, setAlertError] = useState("");
  const [emoji, setEmoji] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  // ? VARIABLES

  // * NAVEGACION A MOVIMIENTOS
  const verMovs = () => {
    navigateTo("Movs");
  };
  // * NAVEGACION A MOVIMIENTOS
  // ? INFO WALLET POST
  async function infoWallet() {
    hideAlert();
    setAlertError("");
    try {
      setLoadingModal(true);
      showAlert();
      const body = {
        token: await getUserToken(),
      };
      const infoResponse = await request2("POST", body, ENDPOINTS.INFOWALLET);

      setWalletData((prev) => ({
        ...prev,
        balance: infoResponse.cardBalanceAvailable || prev.balance,
        mask: infoResponse.masked ?? prev.mask,
        cargos: infoResponse.monthCharges || prev.cargos,
        abonos: infoResponse.monthDeposits || prev.abonos,
        statusCard: infoResponse.status
          ? infoResponse.status == "A"
          : prev.statusCard,
      }));
      setSaldo(infoResponse.cardBalanceAvailable);

      const body2 = {
        type: "0",
        start: "0",
        offset: "5",
      };
      const movsResponse = await request2("POST", body2, ENDPOINTS.MOVS);
      if (
        !movsResponse.transactions ||
        Object.keys(movsResponse.transactions).length === 0
      ) {
        setWalletData((prev) => ({
          ...prev,
          transactions: [],
        }));
      } else {
        setWalletData((prev) => ({
          ...prev,
          transactions: movsResponse.transactions,
        }));
      }
      hideAlert();
    } catch (error) {
      hideAlert();
      setLoadingModal(false);
      setAlertError(
        error?.message
          ? error.message
          : "Sistema no disponible por el momento. Intente de nuevo más tarde."
      );
      setEmoji(error?.emoji ? error.emoji : "⚠️");
      showAlert();
    }
  }
  // ? INFO WALLET POST

  // ! CAMBIO DE ESTATUS
  async function changeStatus(status) {
    hideAlert();
    setAlertError("");

    try {
      setLoadingModal(true);
      showAlert();
      const body = {
        type: status ? "D" : "B",
      };
      const cambioResponse = await request2(
        "POST",
        body,
        ENDPOINTS.CAMBIOESTATUS
      );

      setWalletData((prev) => ({
        ...prev,
        statusCard: !prev.statusCard,
      }));
      hideAlert();
    } catch (error) {
      setLoadingModal(false);

      hideAlert();
      setAlertError(
        error?.message
          ? error.message
          : "Sistema no disponible por el momento. Intente de nuevo más tarde."
      );
      setEmoji(error?.emoji ? error.emoji : "⚠️");
      showAlert();
    }
  }
  // ! CAMBIO DE ESTATUS

  // ! INICIALIZACION DE INFORMACION
  useEffect(() => {
    const initialize = async () => {
      await infoWallet();

      noFirstTime();
    };
    initialize();
  }, []);
  // ! INICIALIZACION DE INFORMACION

  // ? REFRESH
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await infoWallet();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (refreshing) {
      // setLoadingModal(false);
      setLoadingMovs(false);
    }
  }, [refreshing, loadingModal, loadingMovs]);
  // ? REFRESH
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
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Navega o ejecuta lógica adicional
        return true; // Bloquea la navegación por defecto
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Inicio" }],
      });
    }, [])
  );
  return (
    <ImageBackground
      style={[styles.bg_img, style.safeAreaView]}
      source={bg_main}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View>
          <StatusBar translucent={true} style="light" />
          <View style={styles.cardnumberContainer}>
            <CardNumber
              masked={walletData.mask}
              balance={walletData.balance}
              statusCard={walletData.statusCard}
              onChangeStatusCard={changeStatus}></CardNumber>
          </View>

          {/* CARGOS Y ABONOS CONTAINER */}
          <SectionCharges
            abonos={walletData.abonos}
            cargos={walletData.cargos}
          />
          {/* CARGOS Y ABONOS CONTAINER*/}

          {/* Sección de Últimos Movimientos */}
          <View style={styles.movContainer}>
            <View>
              <Text style={styles.txtLeyenda}>Últimos movimientos</Text>
            </View>
            <ScrollView>
              {loadingMovs ? (
                <View
                  style={{
                    flex: 1,
                    padding: 30,
                  }}>
                  <ActivityIndicator size="large" color="#007BFF" />
                </View>
              ) : (
                <View></View>
              )}
              {walletData.transactions.length === 0 ? (
                <View>
                  <Text style={styles.txtVerMas}>
                    No se encontraron movimientos.
                  </Text>
                </View>
              ) : (
                <Movimientos
                  transactions={walletData.transactions}></Movimientos>
              )}
              <TouchableOpacity
                onPress={verMovs}
                style={styles.vermasContainer}>
                <Text style={styles.txtVerMas}>Ver más</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          {/* Sección de Últimos Movimientos */}
          <CustomAlertModal
            visible={visible}
            onClose={hideAlert}
            icon={emoji}
            message={alertError}
            loading={loadingModal}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg_img: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: colors.AzulCopay,
    // paddingTop: Constants.statusBarHeight,
  },
  cardnumberContainer: {
    marginHorizontal: 20,
    // paddingTop: 25,
    margin: 20,
  },
  sectionCharges: {
    // backgroundColor: "rgba(0, 23, 56,0.7)",
    backgroundColor: "rgba(0, 172, 255,0.5)",

    padding: 10,
    marginBottom: 20,
  },
  txtMes: {
    color: "white",
    fontFamily: "MontReg",
    textAlign: "center",
    fontSize: 12,
  },
  txtmonto: {
    fontSize: 16,
    fontFamily: "MontBold",
    fontWeight: "500",
    padding: 5,
    color: "white",
  },
  txtLeyendaCharges: {
    fontSize: 13,
    fontFamily: "MontLight",
    fontWeight: "500",
    paddingHorizontal: 5,
    color: "white",
    textAlign: "center",
  },
  chargesContainer: { flexDirection: "row", justifyContent: "space-around" },
  montoContainer: { flexDirection: "row", alignItems: "center" },
  movContainer: {
    backgroundColor: "white",
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  txtLeyenda: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "RobotoLight",
    letterSpacing: 1.5,
    padding: 10,
  },
  txtVerMas: {
    fontSize: 13,
    textAlign: "center",
    fontFamily: "RobotoLight",
    letterSpacing: 1.5,
    paddingBottom: 10,
  },
});
