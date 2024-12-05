import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigateTo } from "../hooks/usualFunctions";
import { alertCancel } from "../hooks/useBackTo";

export default function BackButton({ color, backTo }) {
  const { navigateTo } = useNavigateTo();
  const handleBackButtonPress = () => {
    alertCancel(() => {
      navigateTo(backTo); // Realiza la acción de volver atrás si el usuario acepta
    });
  };
  return (
    <View>
      <View style={styles.BackButton}>
        <TouchableOpacity onPress={handleBackButtonPress}>
          <FontAwesomeIcon icon={faChevronLeft} size={22} color={color} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  BackButton: {
    paddingHorizontal: 5,
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 1,
  },
});
