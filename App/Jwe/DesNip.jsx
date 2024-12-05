import CryptoJS from "crypto-js";

const decryptNIP = (value) => {
  try {
    const [encryptedNIP, LLAVE] = value.split(":");

    const decryptedBytes = CryptoJS.AES.decrypt(
      encryptedNIP,
      CryptoJS.enc.Utf8.parse(LLAVE),
      {
        mode: CryptoJS.mode.ECB, // Modo ECB
        padding: CryptoJS.pad.Pkcs7, // Padding PKCS7 (equivalente a PKCS5)
      }
    );
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8); // Convertir a UTF-8
    return decryptedData;
  } catch (error) {
    return "";
  }
};

// Ejemplo de uso
const encryptedNIP = "TU_CADENA_ENCRIPTADA_BASE64"; // Reemplázala con tu valor encriptado real
const decryptedNIP = decryptNIP(encryptedNIP);

export default decryptNIP;
