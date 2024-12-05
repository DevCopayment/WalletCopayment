import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TitileContainer({ children, estilos = {} }) {
  return (
    <View style={styles.titleContainer}>
      <Text style={[styles.textTitle, estilos]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: "MontReg",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1,
    textAlign: "center",
  },

  titleContainer: {
    paddingVertical: 30,
    justifyContent: "center",
  },
});
