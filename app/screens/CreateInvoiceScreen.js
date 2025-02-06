import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { PdfCode } from "../components/PdfCode";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateInvoiceScreen = () => {
  const navigation = useNavigation();
  const [gstNumber, setGstNumber] = useState("");
  const [gst, setGst] = useState("");
  const [cess, setCess] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [items, setItems] = useState([
    { id: "1", itemName: "", quantity: 1, unit: "", price: 0, total: 0 },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [invoiceSummary, setInvoiceSummary] = useState("");

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "quantity" || field === "price") {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: (items.length + 1).toString(),
        itemName: "",
        quantity: 1,
        unit: "",
        price: 0,
        total: 0,
      },
    ]);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotal = () => {
    let subtotal = items.reduce((acc, item) => acc + item.total, 0);
    let gstAmount = (subtotal * parseFloat(gst || 0)) / 100;
    let cessAmount = (subtotal * parseFloat(cess || 0)) / 100;
    let total = subtotal + gstAmount + cessAmount;

    return { subtotal, gstAmount, cessAmount, total };
  };

  const handleGenerateInvoice = () => {
    const { subtotal, gstAmount, cessAmount, total } = calculateTotal();

    const summary = `GST Number: ${gstNumber}\nBilling To: ${billingName}, ${billingAddress}\n\nItems:\n${items
      .map(
        (item) =>
          `${item.itemName} - Quantity: ${item.quantity}, Price: ₹${item.price}, Total: ₹${item.total}`
      )
      .join("\n")}\n\nSubtotal: ₹${subtotal.toFixed(
      2
    )}\nGST: ₹${gstAmount.toFixed(2)}\nCess: ₹${cessAmount.toFixed(
      2
    )}\nTotal: ₹${total.toFixed(2)}`;

    setInvoiceSummary(summary);
    setModalVisible(true);
  };

  const printToFile = async () => {
    const { subtotal, gstAmount, cessAmount, total } = calculateTotal();
    const invoiceNumber = new Date().getTime(); // Unique invoice number
    const firstName = billingName.split(" ")[0] || "Invoice"; // Extract first name
    const fileName = `${firstName}_${invoiceNumber}.pdf`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    let html = PdfCode(
      gstNumber,
      gst,
      cess,
      billingName,
      billingAddress,
      items,
      subtotal,
      gstAmount,
      cessAmount
    );

    try {
      const { uri } = await Print.printToFileAsync({ html });

      // Move and rename the file
      await FileSystem.moveAsync({ from: uri, to: fileUri });

      // Save invoice metadata
      const invoiceData = {
        fileName,
        fileUri,
        date: new Date().toLocaleDateString(),
        total: total.toFixed(2),
      };

      const storedInvoices =
        JSON.parse(await AsyncStorage.getItem("invoices")) || [];
      storedInvoices.push(invoiceData);
      await AsyncStorage.setItem("invoices", JSON.stringify(storedInvoices));

      console.log("Invoice saved:", invoiceData);
      Alert.alert("Success", "Invoice saved successfully!");
      return fileUri; // Return the file URI for sharing
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    }
  };

  const handleShare = async () => {
    const fileUri = await printToFile(); // Get the file URI after saving
    if (fileUri) {
      try {
        await shareAsync(fileUri); // Share the file using Expo sharing API
        setModalVisible(false); // Close the modal after sharing
        console.log("Invoice shared successfully!");
      } catch (error) {
        Alert.alert("Error", "Failed to share the invoice.");
      }
    }
  };

  const handleSave = async () => {
    await printToFile(); // Save the file first
    setModalVisible(false); // Close the modal after saving
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Invoice Form</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="GST Number"
        value={gstNumber}
        onChangeText={setGstNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="GST (%)"
        value={gst}
        onChangeText={setGst}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cess (%)"
        value={cess}
        onChangeText={setCess}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Billing Name"
        value={billingName}
        onChangeText={setBillingName}
      />
      <TextInput
        style={styles.input}
        placeholder="Billing Address"
        value={billingAddress}
        onChangeText={setBillingAddress}
      />

      <Text style={styles.sectionTitle}>Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemRow}>
              <TextInput
                style={styles.inputItem}
                placeholder="Item Name"
                value={item.itemName}
                onChangeText={(text) =>
                  handleItemChange(index, "itemName", text)
                }
              />
              <TextInput
                style={styles.inputItem}
                placeholder="Quantity"
                value={String(item.quantity)}
                onChangeText={(text) =>
                  handleItemChange(index, "quantity", parseFloat(text) || 0)
                }
                keyboardType="numeric"
              />
              <TextInput
                style={styles.inputItem}
                placeholder="Unit"
                value={item.unit}
                onChangeText={(text) => handleItemChange(index, "unit", text)}
              />
              <TextInput
                style={styles.inputItem}
                placeholder="Price (₹)"
                value={String(item.price)}
                onChangeText={(text) =>
                  handleItemChange(index, "price", parseFloat(text) || 0)
                }
                keyboardType="numeric"
              />
            </View>

            {/* Move Delete button to a new row */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(index)}
              >
                <Icon name="trash-bin" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        nestedScrollEnabled={true}
        scrollEnabled={false}
      />

      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>

      <Button title="Generate Invoice" onPress={handleGenerateInvoice} />

      <View style={styles.totalContainer}>
        <Text>Total: ₹{calculateTotal().total.toFixed(2)}</Text>
      </View>

      {/* Modal for Invoice Summary */}
      {/* Modal for Invoice Summary */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invoice Summary</Text>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.invoiceDetails}>
                <Text style={styles.invoiceLabel}>GST Number:</Text>
                <Text style={styles.invoiceValue}>{gstNumber || "N/A"}</Text>
              </View>
              <View style={styles.invoiceDetails}>
                <Text style={styles.invoiceLabel}>Billing Name:</Text>
                <Text style={styles.invoiceValue}>{billingName || "N/A"}</Text>
              </View>
              <View style={styles.invoiceDetails}>
                <Text style={styles.invoiceLabel}>Billing Address:</Text>
                <Text style={styles.invoiceValue}>
                  {billingAddress || "N/A"}
                </Text>
              </View>

              <Text style={styles.itemsHeader}>Items</Text>
              {items.map((item, index) => (
                <View key={index} style={styles.itemSummary}>
                  <Text>
                    {item.itemName} - {item.quantity} {item.unit} @ ₹
                    {item.price.toFixed(2)}
                  </Text>
                </View>
              ))}

              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalValue}>
                  ₹{calculateTotal().subtotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>GST ({gst || 0}%):</Text>
                <Text style={styles.totalValue}>
                  ₹{calculateTotal().gstAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Cess ({cess || 0}%):</Text>
                <Text style={styles.totalValue}>
                  ₹{calculateTotal().cessAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.totalSection}>
                <Text style={[styles.totalLabel, styles.grandTotal]}>
                  Total:
                </Text>
                <Text style={[styles.totalValue, styles.grandTotal]}>
                  ₹{calculateTotal().total.toFixed(2)}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setModalVisible(false)} // Close the modal for editing
              >
                {/* <Text style={styles.editButtonText}>Edit</Text> */}
                <Icon name="create" size={24} color="#f0ad4e" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
                {/* <Text style={styles.saveButtonText}>Save</Text> */}
                <Icon name="save" size={24} color="#5bc0de" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                {/* <Text style={styles.saveButtonText}>Share</Text> */}
                <Icon name="share-social" size={24} color="#007bff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 30 },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  itemContainer: {
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputItem: {
    width: "23%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  totalContainer: { marginTop: 20, alignItems: "flex-end" },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalScroll: {
    maxHeight: 300,
  },
  invoiceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  itemsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  itemSummary: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  grandTotal: {
    fontSize: 18,
    color: "#d9534f",
  },
  closeButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%", // Ensure it takes up the full width of the modal
    paddingHorizontal: 10, // Add some padding to ensure buttons are well spaced
  },
  editButton: {
    backgroundColor: "#f0ad4e",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#5bc0de",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  //style for delete button
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginTop: 10,
  },
  shareButton: {
    backgroundColor: "#5bc0de",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  shareButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    width: "30%", // Adjust width based on the layout
  },
});

export default CreateInvoiceScreen;
