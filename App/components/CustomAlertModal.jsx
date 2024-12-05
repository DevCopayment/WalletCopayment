import React, { useContext } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../contexts/AuthContext";
import ProcessingModal from "./ProcessingModal";
import { useNavigation } from "@react-navigation/native";

const CustomAlertModal = ({
  visible,
  onClose,
  icon,
  message,
  loading = false,
}) => {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();
  async function handleClose() {
    const partes = message.split(":"); // Divide la cadena en dos partes
    const numero = partes[0];
    if (numero == 66) {
      onClose();
      await signOut(navigation);
    } else {
      onClose();
    }
  }
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        {loading ? (
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Procesando...</Text>
          </View>
        ) : (
          <View style={styles.alertContainer}>
            <View>
              {/* Renderizado condicional para usar emoji o FontAwesome */}
              {typeof icon === "string" ? (
                <Text style={styles.alertIcon}>{icon}</Text> // Emoji como icono
              ) : (
                <FontAwesome
                  name={icon}
                  size={50}
                  color="#FFA500"
                  style={styles.alertIcon}
                /> // FontAwesome icono
              )}
              <Text style={styles.alertMessage}>{message}</Text>
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity style={styles.button} onPress={handleClose}>
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  alertContainer: {
    width: "100%",
    // marginHorizontal: 50,
    padding: 20,
    backgroundColor: "white",
    // borderRadius: 10,
    // alignItems: "center",
  },
  alertIcon: {
    marginBottom: 15,
    fontSize: 30, // Tamaño del icono/emoji
    alignSelf: "center",
    fontFamily: "RobotoReg",
  },
  alertMessage: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "RobotoReg",
  },
  modalContent: {
    width: 200,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  button: {
    alignItems: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 20,
    // backgroundColor: "#2196F3",
    borderRadius: 5,
    // width: 100,
  },
  buttonText: {
    color: "#007BFF",
    fontFamily: "RobotoReg",
    fontSize: 15,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    fontFamily: "RobotoReg",
    color: "#333",
  },
});

export default CustomAlertModal;
