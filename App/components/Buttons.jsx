import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "../../assets/styles/colors";

const Buttons = ({
  txtColor = Colors.AzulCopay,
  bgColor = "white",
  btnWidth = "60%",
  btnHeight = "auto",
  evento,
  tittle = "Registrarme",
  textStylesCustom,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={evento}
      style={{ alignItems: "center", opacity: isPressed ? 0.8 : 1 }}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <View
        style={[
          styles.btn_container,
          {
            backgroundColor: isPressed ? Colors.Cyan : bgColor,
            width: btnWidth,
            height: btnHeight,
          },
        ]}>
        <Text
          style={[
            styles.text,
            { ...textStylesCustom, color: isPressed ? "white" : txtColor },
          ]}>
          {tittle}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn_container: {
    backgroundColor: "red",
    borderRadius: 50,
    alignItems: "center",
    // flex: 1,
  },
  text: {
    fontFamily: "RobotoBold",
    letterSpacing: 1.5,
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});

export default Buttons;
