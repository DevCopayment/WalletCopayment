import { API_URL } from "@env";
import { API_KEY_VISA, API_KEY_CARNET } from "@env";

const BASE = "auth/";
const USER = "user/";

const createEndpointAuth = (path) => `${API_URL}${BASE}${path}`;
const createEndpointUser = (path) => `${API_URL}${USER}${path}`;

const ENDPOINTS = {
  PREREGISTRO: createEndpointAuth("preregistro"),
  REGISTRO: createEndpointAuth("registro"),
  LOGINFIRST: createEndpointAuth("loginFirst"),
  LOGINCODIGO: createEndpointAuth("loginCodigo"),
  SOLCONTRA: createEndpointAuth("solRestablecerPass"),
  RESCONTRA: createEndpointAuth("restablecerPass"),
  LOGIN: createEndpointAuth("loginNuevo"),
  INFOWALLET: createEndpointUser("infoWallet"),
  CAMBIOESTATUS: createEndpointUser("bloqueartarjeta"),
  MOVS: createEndpointUser("getMovs"),
  TRANSFER: createEndpointUser("traspaso"),
  NIP: createEndpointUser("consultaNip"),
  PROPS: createEndpointAuth("props"),
};
const apiKeys = {
  visa: API_KEY_VISA,
  carnet: API_KEY_CARNET,
};
export { ENDPOINTS, apiKeys };
