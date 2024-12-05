import { SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import style from "../../assets/styles/style";
import Colors from "../../assets/styles/colors";
import BackButton from "./BackButton";
export default function BackgroundCustom({ children, backTo }) {
  return (
    <SafeAreaView style={[style.safeAreaView, styles.safeAreaViewBg]}>
      {backTo ? (
        <BackButton backTo={backTo} color={"white"}></BackButton>
      ) : (
        <></>
      )}
      {/* ARCO CYAN */}
      <View style={styles.arcoCyan}>
        {/* FORMCONTAINER */}
        <View style={styles.formContainer}>{children}</View>
        {/* FORMCONTAINER */}
      </View>
      {/* ARCO CYAN */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaViewBg: {
    backgroundColor: Colors.AzulCopay,
  },
  arcoCyan: {
    backgroundColor: Colors.Cyan,
    flex: 1,
    borderTopLeftRadius: 200,
    marginTop: 30,
    paddingTop: 12,
  },
  formContainer: {
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: 200,
    padding: 30,
  },
});
