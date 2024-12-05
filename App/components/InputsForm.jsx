import React, { useState, useRef, forwardRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Keyboard,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "../../assets/styles/colors";
import {
  faCreditCard,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import colors from "../../assets/styles/colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";
const Input = forwardRef(
  (
    {
      icon,
      visibleIcon = true,
      error,
      nextRef,
      returnKeyType = "next",
      estilos = {},
      ...props
    },
    ref
  ) => {
    const focusNextInput = () => {
      nextRef?.current ? nextRef.current.focus() : Keyboard.dismiss();
    };

    return (
      <View>
        <View style={styles.inputContainer}>
          {visibleIcon && (
            <FontAwesomeIcon icon={icon} size={20} style={styles.inputIcon} />
          )}
          <TextInput
            style={[styles.inputText, { ...estilos }]}
            autoComplete="off"
            textContentType="none"
            returnKeyType={returnKeyType}
            ref={ref}
            onSubmitEditing={focusNextInput}
            {...props}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

const InputImporte = forwardRef(
  (
    {
      icon,
      visibleIcon = true,
      error,
      nextRef,
      returnKeyType = "next",
      estilos = {},
      onChangeText,
      ...props
    },
    ref
  ) => {
    const { format: formatCurrency } = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    });
    const [inputValue, setInputValue] = useState("0.00");

    // Función para formatear el importe con comas y limitar a dos decimales
    const formatImporte = (value) => {
      const cleanedValue = value.replace(/\D/g, "");
      const decimalValue = Number(cleanedValue) / 100;
      return formatCurrency(decimalValue).replace("$", "").trim();
    };

    const handleTextChange = (value) => {
      // Si el valor está vacío, resetea a "0.00"
      if (!value) {
        setInputValue("0.00");
      } else {
        const formattedValue = formatImporte(value);
        setInputValue(formattedValue);
        onChangeText?.(Number(value.replace(/\D/g, "")) / 100);
      }
    };
    return (
      <View>
        <View style={styles.inputContainer}>
          {visibleIcon && (
            <FontAwesomeIcon icon={icon} size={20} style={styles.inputIcon} />
          )}
          <TextInput
            style={[styles.inputText, { ...estilos }]}
            autoComplete="off"
            textContentType="none"
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={handleTextChange}
            value={inputValue}
            {...props}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

const CardNumberInput = forwardRef(
  ({ onChangeText, resetValue, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // ? MASKED
    const formatCardNumber = (number) => {
      return number.replace(/\d{4}(?=\d)/g, "$& ");
    };
    const maskCardNumber = (cardnumber) => {
      const number = cardnumber.replace(/\s+/g, "");
      if (number.length <= 4) {
        return number;
      } else if (number.length <= 8) {
        return `${number.slice(0, 4)} ${number.slice(4)}`;
      } else if (number.length <= 12) {
        return `${number.slice(0, 4)} ${number.slice(4, 8)} ${number.slice(8)}`;
      } else {
        return `${number.slice(0, 4)} **** **** ${number.slice(12)}`;
      }
    };
    // ? MASKED

    const handleTextChange = (value) => {
      if (value === null || value === undefined || value === "") {
        setInputValue("");
      } else {
        setInputValue(value);
        onChangeText?.(value);
      }
    };

    useEffect(() => {
      // Resetea el valor visual si inputValue está vacío
      if (inputValue === "") {
        setInputValue(""); // Garantiza que el Input se resetee visualmente
      }
    }, [inputValue]);

    const formattedValue = !isFocused
      ? maskCardNumber(inputValue)
      : formatCardNumber(inputValue);

    useEffect(() => {
      if (resetValue) {
        setInputValue(""); // Resetea el valor cuando resetValue es true
      }
    }, [resetValue]);

    return (
      <View>
        <Input
          icon={faCreditCard}
          keyboardType="numeric"
          placeholder="Número de tarjeta"
          maxLength={19}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={handleTextChange}
          value={formattedValue}
          {...props}
        />
      </View>
    );
  }
);

const CheckBoxCustom = ({ checkColor, text, error, evento, ...props }) => {
  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          {
            borderWidth: 0,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}>
        {/* <CheckBox {...props} color={props.value ? Colors.Cyan : undefined} /> */}
        <BouncyCheckbox
          size={25}
          disableText
          fillColor={Colors.Cyan}
          unFillColor="#FFFFFF"
          text={text}
          iconStyle={{}}
          innerIconStyle={{ borderWidth: 1 }}
          {...props}
        />

        <Text
          style={[
            styles.inputText,
            {
              width: "auto",
              fontSize: 12,
              textAlign: "center",
              textDecorationLine: "underline",
            },
          ]}
          onPress={evento}>
          {text}
        </Text>
      </View>

      {error ? (
        <Text style={[styles.errorText, { textAlign: "center" }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const InputCode = ({
  length = 6,
  onChangeCode,
  error,
  secureTextEntry = false,
}) => {
  const [code, setCode] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text !== "" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    onChangeCode?.(newCode.join(""));
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View>
      <View style={styles.inputCodeView}>
        {code.map((digit, index) => (
          <View style={styles.inputCodeContainer} key={index}>
            <TextInput
              style={[
                styles.inputCircle,
                { textAlign: "center", paddingLeft: 0 },
              ]}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={secureTextEntry ? (digit ? "•" : "") : digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              maxLength={1}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        ))}
      </View>
      {error ? (
        <Text style={[styles.errorText, { textAlign: "center" }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const InputPass = ({ icon, error, ...props }) => {
  const [secure, setSecure] = useState(true);

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          error ? { borderColor: "red" } : { borderColor: colors.AzulCopay },
        ]}>
        {icon ? (
          <FontAwesomeIcon icon={icon} size={20} style={styles.inputIcon} />
        ) : (
          <></>
        )}
        <TextInput
          style={[styles.inputText, { flex: 1 }]}
          autoComplete="off"
          textContentType="none"
          secureTextEntry={secure}
          {...props}
        />
        <Pressable onPress={() => setSecure(!secure)} style={{ opacity: 0.7 }}>
          <FontAwesomeIcon
            color={Colors.AzulCopay}
            icon={secure ? faEyeSlash : faEye}
            size={18}></FontAwesomeIcon>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderColor: Colors.AzulCopay,
    borderWidth: 0.5,
    borderRadius: 15,
    marginTop: 18,
    marginHorizontal: 15,
  },
  inputIcon: {
    color: Colors.AzulCopay,
  },
  inputText: {
    fontFamily: "MontLight",
    width: "100%",
    paddingVertical: 5,
    fontSize: 15,
    paddingLeft: 15,
  },
  errorText: {
    color: Colors.Rojo,
    fontFamily: "RobotoLight",
    fontSize: 10,
    paddingRight: 20,
    paddingLeft: 10,
    textAlign: "right",
    marginTop: 5,
  },
  // INPUTCODE
  inputCodeContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    textAlign: "center",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderColor: Colors.AzulCopay,
    borderWidth: 0.5,
    borderRadius: 6,
    marginTop: 18,
    marginHorizontal: 5,
    flex: 1,

    width: "50%",
  },
  inputCodeView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  // INPUTCODE
});

export {
  Input,
  InputPass,
  InputCode,
  CardNumberInput,
  CheckBoxCustom as CheckBox,
  InputImporte,
};
