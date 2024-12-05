import { useNavigation } from "@react-navigation/native";

// Navegar
export const useNavigateTo = () => {
  const navigation = useNavigation();

  const navigateTo = (route, params = {}) => {
    navigation.navigate(route, params);
  };

  return { navigateTo };
};
