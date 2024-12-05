import { useState } from "react";
import { validateField } from "./validateForm.jsx";

export const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formValues).forEach((key) => {
      const error = validateField(key, formValues[key], formValues);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateConfirmPassword = (formValues, value) => {
    let errorConfirmPass = validateField(
      "confirmPassword",
      formValues.confirmPassword,
      { password: value }
    );
    return errorConfirmPass;
  };

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    const error = validateField(name, value, formValues);
    if (name == "password") {
      let errorConfirmPass = validateConfirmPassword(formValues, value);
      setErrors({
        ...errors,
        [name]: error,
        ["confirmPassword"]: errorConfirmPass,
      });
    } else {
      setErrors({ ...errors, [name]: error });
    }
  };
  const reset = () => {
    setFormValues(initialValues); // Restaura los valores iniciales del formulario
    setErrors({}); // Opcionalmente, también puedes resetear los errores
  };

  return {
    formValues,
    errors,
    handleChange,
    validateForm,
    reset,
    setFormValues,
  };
};
