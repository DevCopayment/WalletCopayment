import { Component } from "react";
import jose from "node-jose";
import { JWE } from "node-jose";
import KeyStore from "./KeyStore";
// import Constants from 'expo-constants';

// import PUBLIC_KEY_API from 'react-native-dotenv';
export default class CertificateUtils extends Component {
  constructor() {
    super();
    this.loadPublicKeyFromPem;
    this.createJWE;
  }

  // PUBLIC KEY
  async loadPublicKeyFromPem() {
    const publicKey = await jose.JWK.asKey(KeyStore().PUBLIC_KEY_API, "pem");
    return publicKey;
  }
  // private KEY
  async loadPrivateKeyFromPem() {
    const privateKey = await jose.JWK.asKey(KeyStore().PRIVATE_KEY_APP, "pem");
    return privateKey;
  }

  //JWE
  async createJWE(
    plainText,
    kid,
    publicKey,
    jweAlgorithm,
    encryptionMethod,
    additionalHeaders
  ) {
    try {
      const jweHeader = {
        alg: jweAlgorithm,
        enc: encryptionMethod,
        kid: kid,
        ...additionalHeaders,
      };

      const jwe = await JWE.createEncrypt(
        { format: "compact", fields: jweHeader },
        publicKey
      )

        .update(JSON.stringify(plainText))
        .final();

      const jweString = jwe.toString();
      return jweString;
    } catch (error) {}
  }

  async decryptJWE(jweString, privateKey) {
    try {
      // Crear un objeto JWE a partir de la cadena JWE
      const jwe = await jose.JWE.createDecrypt(privateKey).decrypt(jweString);

      // El resultado es un objeto JSON desencriptado
      const plainText = JSON.parse(jwe.plaintext.toString());
      return plainText;
    } catch (error) {
      throw error;
    }
  }
}
