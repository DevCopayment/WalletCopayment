import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import style from "../../assets/styles/style";
import Colors from "../../assets/styles/colors";
import { StatusBar } from "expo-status-bar";
import logoHorizontal from "../../assets/images/logo_signin.png";

const BackgroundSignIn = ({ children }) => {
  return (
    <SafeAreaView
      style={[
        style.safeAreaView,
        {
          backgroundColor: "white",
        },
      ]}>
      <StatusBar backgroundColor={Colors.AzulCopay} style="light"></StatusBar>

      <View style={styles.logo_imgContainer}>
        <Image source={logoHorizontal} style={styles.logo_img}></Image>
      </View>
      {/* FORMCONTAINER */}
      <View style={styles.formContainer}>{children}</View>
      {/* FORMCONTAINER */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 30,
    // height: "40%",
    backgroundColor: Colors.AzulCopay,
    borderTopLeftRadius: 100,
    // borderBottomEndRadius: 100,

    flex: 3,
  },
  logo_img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  logo_imgContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: "center",
  },
});

export default BackgroundSignIn;
