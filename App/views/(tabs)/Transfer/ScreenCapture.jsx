import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
const ScreenCapture = () => {
  const viewRef = useRef();
  const [uri, setUri] = useState("");
  const captureScreen = () => {
    captureRef(viewRef, {
      format: "png",
      quality: 0.6,
    }).then(
      (uri) => console.log("Image can be accessed at: ", uri),
      (error) => console.error("Snapshot failed", error)
    );
  };
  return (
    <View style={styles.container}>
      <View ref={viewRef} style={styles.viewShot} collapsable={false}>
        <View
          collapsable={false}
          style={{ width: 200, height: 200, backgroundColor: "red" }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={captureScreen} style={styles.btn}>
          <Text style={styles.btnTxt}>CAPTURE</Text>
        </TouchableOpacity>
      </View>
      {uri ? (
        <View style={styles.previewContainer}>
          <Text>Preview</Text>
          <Image
            source={{ uri: uri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      ) : null}
    </View>
  );
};
const SCREEN_WIDTH = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewShot: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  buttonContainer: {
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btn: {
    padding: 8,
  },
  btnTxt: {
    fontSize: 20,
    fontWeight: "bold",
  },
  //   previewContainer
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#000",
  },
  previewImage: { width: 200, height: 200, backgroundColor: "#fff" },
});
export default ScreenCapture;
