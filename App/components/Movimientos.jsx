import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Movimientos = ({ transactions }) => {
  const [sortedKeys, setSortedKeys] = useState([]);

  const sortTransactionKeys = (trans) => {
    // Obtener las claves (keys) y ordenarlas según la fecha en el campo `date` de cada transacción
    const sortedKeys = Object.keys(trans).sort((keyA, keyB) => {
      const dateA = new Date(trans[keyA][0].date);
      const dateB = new Date(trans[keyB][0].date);
      return dateB - dateA;
    });

    return sortedKeys;
  };

  useEffect(() => {
    if (transactions) {
      const orderedKeys = sortTransactionKeys(transactions);
      setSortedKeys(orderedKeys);
    }
  }, [transactions]); // Ahora depende de `transactions`

  return (
    <View style={styles.container}>
      {sortedKeys.map((dateKey) => (
        <View key={dateKey} style={styles.dateGroup}>
          <Text style={styles.dateText}>{dateKey}</Text>
          {transactions[dateKey].map((transaction, index) => (
            <View
              key={`${dateKey}-${transaction.movDescription}-${index}`}
              style={styles.transactionRow}>
              <FontAwesomeIcon
                icon={faCircle}
                color={transaction.nature === "A" ? "#00FFB3" : "#FF6B6B"}
                size={8}
                style={{ marginRight: 8 }}
              />
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText} numberOfLines={1}>
                  {transaction.movDescription}
                </Text>
                <Text style={styles.referenceText}>
                  {transaction.reference}
                </Text>
              </View>
              <Text
                style={[
                  styles.amountText,
                  transaction.nature === "A"
                    ? styles.amountAbono
                    : styles.amountCargo,
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}>
                {transaction.nature === "A"
                  ? `+ $${transaction.amount}`
                  : `$${transaction.amount}`}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#001738",
  },
  dateGroup: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  dateText: {
    fontSize: 13,
    // fontWeight: "bold",
    // fontWeight: "500",
    // color: "#FFFFFF",
    color: "#00275e",
    fontFamily: "RobotoReg",
    marginBottom: 5,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  descriptionContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: "RobotoReg",
    // color: "#FFFFFF",
  },
  referenceText: {
    fontSize: 12,
    color: "gray",
    fontFamily: "RobotoLight",
  },
  amountText: {
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "MontLight",
    letterSpacing: 1.2,
  },
  amountAbono: {
    color: "#007754",
  },
  amountCargo: {
    color: "black",
  },

  vermasContainer: {},
});
export default Movimientos;
