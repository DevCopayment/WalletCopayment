import { useState } from "react";
import { useNavigateTo } from "./usualFunctions";
import { useNavigation } from "@react-navigation/native";

const useAlert = () => {
  const [visible, setVisible] = useState(false);
  const { navigateTo } = useNavigateTo();
  const navigation = useNavigation();

  const hideAlert = () => {
    setVisible(false);
  };
  const showAlert = (icon, message) => {
    setVisible(true);
  };
  const hideAlertBack = (backto) => {
    setVisible(false);
    navigateTo(backto);
  };
  const hideAlertBackScreen = (backto, screenTo) => {
    setVisible(false);
    navigation.navigate(backto, { screen: screenTo });
  };

  return { visible, hideAlert, showAlert, hideAlertBack, hideAlertBackScreen };
};

export default useAlert;
