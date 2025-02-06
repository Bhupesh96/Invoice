import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { shareAsync } from "expo-sharing";
import Icon from "react-native-vector-icons/Ionicons";

const InvoiceListScreen = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    const storedInvoices =
      JSON.parse(await AsyncStorage.getItem("invoices")) || [];
    setInvoices(storedInvoices);
  };

  const handleShare = async (fileUri) => {
    try {
      await shareAsync(fileUri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      Alert.alert("Error", "Unable to share invoice.");
    }
  };

  const handleDelete = async (fileName) => {
    Alert.alert(
      "Delete Invoice",
      "Are you sure you want to delete this invoice?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const newInvoices = invoices.filter(
                (inv) => inv.fileName !== fileName
              );
              await AsyncStorage.setItem(
                "invoices",
                JSON.stringify(newInvoices)
              );
              setInvoices(newInvoices);

              // Delete file from storage
              const fileUri = `${FileSystem.documentDirectory}${fileName}`;
              await FileSystem.deleteAsync(fileUri, { idempotent: true });

              Alert.alert("Deleted", "Invoice has been deleted.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete invoice.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Invoices</Text>

      {invoices.length === 0 ? (
        <Text style={styles.noInvoices}>No invoices found.</Text>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.fileName}
          renderItem={({ item }) => (
            <View style={styles.invoiceItem}>
              <Text style={styles.invoiceText}>{item.fileName}</Text>
              <Text style={styles.invoiceDate}>Date: {item.date}</Text>
              <Text style={styles.invoiceTotal}>Total: ₹{item.total}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => handleShare(item.fileUri)}>
                  <Icon name="share-social" size={24} color="blue" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.fileName)}>
                  <Icon name="trash-bin" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 30 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  noInvoices: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
  invoiceItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  invoiceText: { fontSize: 16, fontWeight: "bold" },
  invoiceDate: { fontSize: 14, color: "gray", marginTop: 5 },
  invoiceTotal: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
});

export default InvoiceListScreen;
