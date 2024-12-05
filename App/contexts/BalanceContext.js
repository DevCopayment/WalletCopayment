// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState("");

  const setSaldo = async (monto) => {
    setBalance(monto);
  };

  const getSaldo = () => {
    return balance;
  };

  return (
    <BalanceContext.Provider value={{ balance, setSaldo, getSaldo }}>
      {children}
    </BalanceContext.Provider>
  );
};
