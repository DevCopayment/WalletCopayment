// Funciones de validación individuales
const validateCardNumber = (value) => {
  const cardnumber = value.replace(/\s+/g, "");
  if (!cardnumber) {
    return "El número de tarjeta es obligatorio";
  } else if (!/^\d{16}$/.test(cardnumber)) {
    return "El número de tarjeta no es válido";
  }
  return "";
};
const validateCardNumberTransfer = (value) => {
  const cardnumber = value.replace(/\s+/g, "");
  if (!cardnumber) {
    return "El número de tarjeta es obligatorio ";
  } else if (!/^\d{16}$/.test(cardnumber)) {
    return "El número de tarjeta no es válido";
  }
  return "";
};

const validateEmail = (value) => {
  if (!value) {
    return "El correo electrónico es obligatorio";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "El correo electrónico no es válido";
  }
  return "";
};

const validateCelular = (value) => {
  if (!value) {
    return "El número de celular es obligatorio";
  } else if (!/^\d{10}$/.test(value)) {
    return "Número de celular no válido";
  }
  return "";
};

const validateCodigo = (value) => {
  if (!value || !/^\d{6}$/.test(value)) {
    return "Código no válido";
  }
  return "";
};

const validatePassword = (value) => {
  if (!value) {
    return "La contraseña es obligatoria";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      value
    )
  ) {
    return "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial";
  }
  return "";
};
const validatePasswordSingIn = (value) => {
  if (!value) {
    return "La contraseña es obligatoria";
  }
  return "";
};
const validateimporte = (value, saldoDisponible) => {
  if (!value || value <= 0) {
    return "El importe debe ser mayor a $0.00";
  } else if (saldoDisponible !== undefined && value > saldoDisponible) {
    return `El importe no puede ser mayor a tu saldo disponible de $${saldoDisponible}`;
  } else if (value > 50000) {
    return "El importe no debe ser mayor a $50,000.00";
  }
  return "";
};
const validateConfirmPassword = (value, password) => {
  if (value !== password) {
    return "Las contraseñas no coinciden";
  }
  return "";
};

const validateTerminos = (value) => {
  if (!value) {
    return "Para continuar debes aceptar el aviso de privacidad";
  }
  return "";
};

// Función principal de validación
export const validateField = (name, value, additionalFields = {}) => {
  switch (name) {
    case "cardNumber":
      return validateCardNumber(value);
    case "email":
      return validateEmail(value);
    case "celular":
      return validateCelular(value);
    case "codigo":
      return validateCodigo(value);
    case "password":
      return validatePassword(value);
    case "confirmPassword":
      return validateConfirmPassword(value, additionalFields.password);
    case "terminos":
      return validateTerminos(value);
    case "pass":
      return validatePasswordSingIn(value);
    case "importe":
      return validateimporte(value, additionalFields.saldoDisponible);
    case "cardNumberTransfer":
      return validateCardNumberTransfer(value);
    default:
      return "";
  }
};
