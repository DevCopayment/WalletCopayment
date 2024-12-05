import { Text, StyleSheet, View, Alert } from "react-native";
import React, { Component } from "react";

const alertError = () => {
  Alert.alert(
    "⚠️",
    "Sistema no disponible por el momento. Intente de nuevo más tarde",
    [
      {
        text: "Ok",
      },
    ]
  );
};

export default alertError;
