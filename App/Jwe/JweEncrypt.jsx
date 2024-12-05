import { Component } from "react";

import CertificateUtils from "./CertificateUtils";

export default class JweEncrypt extends Component {
  constructor() {
    super();
  }

  async encryptJWE(request) {
    const publicKey = await new CertificateUtils().loadPublicKeyFromPem();
    const kid = "RF989lIIYSdoZWy-Qj5YdSAIi8uiaKm-d3vS3CR-oaka";
    const additionalHeaders = { iat: Math.floor(Date.now() / 1000) };

    const jwe = await new CertificateUtils().createJWE(
      request,
      kid,
      publicKey,
      "RSA-OAEP-256",
      "A256GCM",
      additionalHeaders
    );
    return jwe;
  }

  async createjwe(campos) {
    try {
      const jwe = await this.encryptJWE(campos);
      const request = {
        encryptedData: jwe,
      };

      return request;
    } catch (error) {
      const request = {
        encryptedData: "error",
      };
      return request;
    }
  }
}
