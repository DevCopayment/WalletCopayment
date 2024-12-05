import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text as TextReactN,
  StyleSheet,
  Modal,
  ScrollView,
  AppState,
  ActivityIndicator,
} from "react-native";
import {
  Canvas,
  Text,
  useFont,
  Fill,
  Image,
  useImage,
  Line,
} from "@shopify/react-native-skia";
import colors from "../../../../assets/styles/colors";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import Buttons from "../../../components/Buttons";
import { useBackTo } from "../../../hooks/useBackTo";
import { useNavigateTo } from "../../../hooks/usualFunctions";
import style from "../../../../assets/styles/style";

const useRerenderOnAppStateChange = () => {
  const [_, setRerender] = useState(0);

  useEffect(() => {
    const handleChange = () => {
      setRerender((prev) => prev + 1);
    };
    const subscription = AppState.addEventListener("change", handleChange);

    return () => subscription.remove();
  }, []);
};

function TransferReceipt({ route }) {
  useBackTo("MyTabs");
  useRerenderOnAppStateChange();
  const { navigateTo } = useNavigateTo();
  const [info, setInfo] = useState(route.params.info);

  const skiaRef = useRef(null);

  const [imageUri, setImageUri] = useState(null); // Estado para la imagen capturada
  const appState = useRef(AppState.currentState);
  const [loading, setLoading] = useState(true); // Estado de carga
  const logo = useImage(require("../../../../assets/images/logo_signin.png"));
  const windowWidth = Dimensions.get("screen").width;
  const windowHeight = Dimensions.get("screen").height;
  const padding = 50;
  const lineSpacing = 30;
  const groupSpacing = 20;

  // Cargar fuentes personalizadas
  const font = useFont(
    require("../../../../assets/fonts/Roboto/Roboto-Regular.ttf"),
    15
  );
  const fontTitle = useFont(
    require("../../../../assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    22
  );
  const fontSubTitle = useFont(
    require("../../../../assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    12
  );
  const fontLabel = useFont(
    require("../../../../assets/fonts/Roboto/Roboto-Bold.ttf"),
    15
  );

  const formatCurrency = (value, locale = "es-MX", currency = "MXN") => {
    if (isNaN(value) || value === null || value === undefined || value === "") {
      return value;
    }
    const formattedValue = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);

    return formattedValue.replace(/(\$\s?)/, "$1 ");
  };
  const titleText = "Comprobante de transferencia";
  const maxWidth = windowWidth - padding * 2; // Ancho máximo del texto
  const lineHeight = 30;
  const textLeyenda = "Copayment de México S.A.P.I. de C.V";
  const textWidth = fontSubTitle ? fontSubTitle.getTextWidth(textLeyenda) : 0; // Calcula el ancho del texto

  const wrapText = (text, font, maxWidth) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = font.getTextWidth(`${currentLine} ${word}`);
      if (width < maxWidth) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const onCapture = async () => {
    try {
      const snapshot = skiaRef.current.makeImageSnapshot();
      const imageBase64 = snapshot.encodeToBase64(); // Convierte a base64
      const uri = `${FileSystem.documentDirectory}receipt.png`;
      await FileSystem.writeAsStringAsync(uri, imageBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert("No se puede compartir en este dispositivo");
        return;
      }
      await Sharing.shareAsync(uri);
      setImageUri(uri); // Guarda la URI en el estado
      return uri;
    } catch (error) {
      console.error("Error al capturar o compartir la imagen:", error);
    }
  };
  useEffect(() => {
    if (fontTitle && logo) {
      setLoading(false); // Update loading state when resources are ready
    }
  }, [fontTitle, logo]);

  return (
    <View style={{ paddingBottom: 10, flex: 1, backgroundColor: "white" }}>
      <View style={style.safeAreaView}>
        <ScrollView
          style={styles.modalBackground}
          showsVerticalScrollIndicator={true}>
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                paddingBottom: 5,
              }}>
              <ActivityIndicator size="large" color={colors.AzulCopay} />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                paddingBottom: 5,
              }}>
              <Canvas
                ref={skiaRef}
                style={{ height: windowHeight * 0.85, width: windowWidth }}>
                <Fill color={"white"} />

                {/* Logo */}
                <Image
                  image={logo}
                  x={windowWidth * 0.1}
                  y={20}
                  width={windowWidth * 0.8}
                  height={windowHeight * 0.1}
                  fit="contain"
                />

                {fontTitle &&
                  wrapText(titleText, fontTitle, maxWidth).map(
                    (line, index) => (
                      <Text
                        key={index}
                        text={line}
                        x={padding}
                        y={windowHeight * 0.17 + index * lineHeight}
                        font={fontTitle}
                      />
                    )
                  )}
                {/* Detalles */}
                <Text
                  text="Concepto:"
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing}
                  font={fontLabel}
                />
                <Text
                  text="TRASPASO"
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 2}
                  font={font}
                />

                <Text
                  text="Origen:"
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 3 + groupSpacing}
                  font={fontLabel}
                />
                <Text
                  text={`Tarjeta * ${info.origen}`}
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 4 + groupSpacing}
                  font={font}
                />

                <Text
                  text="Destino:"
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 5 + groupSpacing * 2}
                  font={fontLabel}
                />
                <Text
                  text={`Tarjeta * ${info.destino}`}
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 6 + groupSpacing * 2}
                  font={font}
                />

                <Text
                  text="Monto:"
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 7 + groupSpacing * 3}
                  font={fontLabel}
                />
                <Text
                  text={`${formatCurrency(info.monto)}`}
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 8 + groupSpacing * 3}
                  font={font}
                />

                <Text
                  text="Folio de operación:"
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 9 + groupSpacing * 4}
                  font={fontLabel}
                />
                <Text
                  text={info.folio}
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 10 + groupSpacing * 4}
                  font={font}
                />

                <Text
                  text="Fecha de operación:"
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 11 + groupSpacing * 5}
                  font={fontLabel}
                />
                <Text
                  text={info.fecha}
                  x={padding}
                  y={windowHeight * 0.22 + lineSpacing * 12 + groupSpacing * 5}
                  font={font}
                />
                <Line
                  p1={{
                    x: padding,
                    y:
                      windowHeight * 0.22 +
                      lineSpacing * 12.5 +
                      groupSpacing * 5.5,
                  }}
                  p2={{
                    x: windowWidth - padding,
                    y:
                      windowHeight * 0.22 +
                      lineSpacing * 12.5 +
                      groupSpacing * 5.5,
                  }}
                  color={"gray"}
                  style="stroke"
                  strokeWidth={1}
                />
                {fontSubTitle && (
                  <Text
                    text={textLeyenda}
                    color={colors.AzulCopay}
                    x={windowWidth - padding - textWidth} // Calcula la posición X
                    y={
                      windowHeight * 0.22 +
                      lineSpacing * 13.5 +
                      groupSpacing * 5
                    }
                    font={fontSubTitle}
                  />
                )}
              </Canvas>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          style={{
            alignItems: "center",
            paddingTop: 15,
          }}
          onPress={onCapture}>
          <FontAwesomeIcon
            icon={faShareNodes}
            size={25}
            color={"gray"}></FontAwesomeIcon>
          <TextReactN
            style={{
              padding: 10,
              fontFamily: "RobotoReg",
              fontSize: 11,
              color: "gray",
            }}>
            Compartir
          </TextReactN>
        </TouchableOpacity>
        <View style={{ paddingTop: 5, paddingBottom: 50 }}>
          <Buttons
            bgColor={colors.AzulCopay}
            txtColor="white"
            tittle="Finalizar"
            evento={() => navigateTo("MyTabs")}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "white",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 40,
    flex: 1,
    // justifyContent: "center",
  },
  label: {
    fontFamily: "RobotoBold",
    fontSize: 14,
    letterSpacing: 1,
    // paddingLeft: 15,
  },
  label2: {
    fontFamily: "RobotoReg",
    fontSize: 14,
    letterSpacing: 1,
    // paddingLeft: 15,
  },
  tittle: {
    fontSize: 20,
    fontFamily: "MontReg",
    // textAlign: "center",
  },
  viewEncabezado: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    // paddingLeft: 5,

    justifyContent: "space-between",
  },
  BtnContainer: {
    marginTop: 15,
  },
  bg_img: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  bg_imgContainer: {
    width: "100%",
    height: "10%",
    // backgroundColor: "green",
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
export default TransferReceipt;
