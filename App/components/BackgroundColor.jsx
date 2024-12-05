import { SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import style from "../../assets/styles/style";
import Colors from "../../assets/styles/colors";
import BackButton from "./BackButton";
import { StatusBar } from "expo-status-bar";
export default function BackgroundColor({
  children,
  color = "white",
  backTo,
  colorBack = Colors.AzulCopay,
}) {
  return (
    <SafeAreaView style={[style.safeAreaView, { backgroundColor: { color } }]}>
      <StatusBar backgroundColor={Colors.AzulCopay} style="light"></StatusBar>
      {/* BACKBUTTON */}
      {backTo ? (
        <BackButton backTo={backTo} color={colorBack}></BackButton>
      ) : (
        <></>
      )}
      {/* BACKBUTTON */}
      {/* FORMCONTAINER */}
      <View style={styles.formContainer}>{children}</View>
      {/* FORMCONTAINER */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "white",
    flex: 1,
    alignContent: "center",
    padding: 30,
    // paddingTop: 20,
    // marginTop: "10%",
  },
});
