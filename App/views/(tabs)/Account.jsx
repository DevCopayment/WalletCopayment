import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import colors from "../../../assets/styles/colors";
import style from "../../../assets/styles/style";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBan,
  faInfoCircle,
  faSignOut,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { WebView } from "react-native-webview";
import TitileContainer from "../../components/TitileContainer";
import { URL_AVISOP } from "@env";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigateTo } from "../../hooks/usualFunctions";
import { useBackTo } from "../../hooks/useBackTo";
import { useNavigation } from "@react-navigation/native";

const AvisoPrivacidad = ({ showModal, setShowModal }) => {
  const [loading, setLoading] = useState(true);
  const handleLoadStart = () => {
    setLoading(true); // Empieza a cargar, muestra el indicador
  };

  const handleLoadEnd = () => {
    setLoading(false); // Se terminó de cargar, oculta el indicador
  };
  return (
    <Modal transparent={false} visible={showModal}>
      <View style={styles.webViewContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingTop: 20,
          }}>
          <TitileContainer estilos={styles.title}>
            Aviso de Privacidad
          </TitileContainer>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{ paddingLeft: 20 }}>
            <FontAwesomeIcon icon={faX} color="white"></FontAwesomeIcon>
          </TouchableOpacity>
        </View>

        <WebView
          style={{ flex: 1 }}
          source={{ uri: URL_AVISOP }}
          onLoad={handleLoadStart}
          onLoadProgress={handleLoadStart}
          onLoadStart={handleLoadStart} // Cuando empieza la carga
          onLoadEnd={handleLoadEnd} // Cuando termina la carga
        />
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.Cyan} />
          </View>
        )}
      </View>
    </Modal>
  );
};

const EliminarCuenta = ({ showModal, setShowModal }) => {
  const [loading, setLoading] = useState(true);
  const handleLoadStart = () => {
    setLoading(true); // Empieza a cargar, muestra el indicador
  };

  const handleLoadEnd = () => {
    setLoading(false); // Se terminó de cargar, oculta el indicador
  };
  return (
    <Modal transparent={false} visible={showModal}>
      <View style={styles.webViewContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingTop: 20,
          }}>
          <TitileContainer estilos={styles.title}>
            Eliminar cuenta
          </TitileContainer>
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{ paddingLeft: 20 }}>
            <FontAwesomeIcon icon={faX} color="white"></FontAwesomeIcon>
          </TouchableOpacity>
        </View>

        <WebView
          style={{ flex: 1 }}
          source={{ uri: "https://copayment.com.mx/eliminacion-de-cuenta/" }}
          onLoad={handleLoadStart}
          onLoadProgress={handleLoadStart}
          onLoadStart={handleLoadStart} // Cuando empieza la carga
          onLoadEnd={handleLoadEnd} // Cuando termina la carga
        />
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.Cyan} />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default function Account() {
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const { signOut } = useContext(AuthContext);
  const { navigateTo } = useNavigateTo();
  const [showModal2, setShowModal2] = useState(false);

  function abrirAviso() {
    setShowModal(true);
  }
  function abrirEliminar() {
    setShowModal2(true);
  }

  function cerrarSesion() {
    Alert.alert("Cerrar Sesión", "¿Estas seguro de que deseas cerrar sesión?", [
      {
        text: "Cancelar",
      },
      {
        text: "Aceptar",
        onPress: () => {
          signOut(navigation);
        },
        // Llama al callback si el usuario acepta
      },
    ]);
  }

  return (
    <View style={[styles.container, style.safeAreaView]}>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => cerrarSesion()}>
        <FontAwesomeIcon
          icon={faSignOut}
          color="white"
          size={20}></FontAwesomeIcon>
        <Text style={styles.txtBtn}>Cerrar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => abrirEliminar()}>
        <FontAwesomeIcon icon={faBan} color="white" size={20}></FontAwesomeIcon>
        <Text style={styles.txtBtn}>Eliminar cuenta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => abrirAviso()}>
        <FontAwesomeIcon
          icon={faInfoCircle}
          color="white"
          size={20}></FontAwesomeIcon>
        <Text style={styles.txtBtn}>Aviso de privacidad</Text>
      </TouchableOpacity>
      <AvisoPrivacidad
        setShowModal={setShowModal}
        showModal={showModal}></AvisoPrivacidad>
      <EliminarCuenta
        setShowModal={setShowModal2}
        showModal={showModal2}></EliminarCuenta>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.AzulCopay,
    flex: 1,
  },
  btnContainer: {
    borderColor: "white",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: "rgba(0, 8, 19,0.4)",
    // margin: 20,}
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  txtBtn: {
    color: "white",
    fontFamily: "MontReg",
    letterSpacing: 1.2,
    paddingHorizontal: 20,
  },
  webViewContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: colors.AzulCopay,
  },
  title: {
    fontSize: 15,
    textAlign: "left",
    color: "white",
    margin: 0,
    padding: 0,
  },
  loaderContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});
