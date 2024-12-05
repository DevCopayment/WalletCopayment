import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";

const SuccessModal = ({ visible, message }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.alertContainer}>
          {/* Renderizado condicional para usar emoji o FontAwesome */}

          <FontAwesomeIcon
            icon={faCheckCircle}
            size={40}
            color="#00c313"
            style={styles.alertIcon}
          />

          <Text style={styles.alertMessage}>{message}</Text>
        </View>
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
    paddingHorizontal: 20,
    // paddingTop: 30,
    height: "20%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  alertIcon: {
    marginBottom: 15,
    fontSize: 50, // Tamaño del icono/emoji
    alignSelf: "center",
    fontFamily: "RobotoReg",
  },
  alertMessage: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    // marginBottom: 20,
    fontFamily: "RobotoReg",
  },
});

export default SuccessModal;
