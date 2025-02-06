import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as Sharing from "expo-sharing";

const InvoiceDetailScreen = ({ route }) => {
  const { invoice } = route.params;

  const generatePDF = async () => {
    const htmlContent = `
      <h1>Invoice</h1>
      <p>Client: ${invoice.clientName}</p>
      <p>Amount: $${invoice.amount}</p>
      <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
    `;

    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `invoice_${invoice.id}`,
        base64: false,
      });

      console.log("PDF Path:", pdf.filePath); // Check the file path
      await Sharing.shareAsync(pdf.filePath); // Try to share the PDF
    } catch (error) {
      console.error("Error generating PDF:", error); // Log any errors
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invoice Details</Text>
      <Text>Client: {invoice.clientName}</Text>
      <Text>Amount: ${invoice.amount}</Text>
      <Text>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
      <Button title="Generate PDF" onPress={generatePDF} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

export default InvoiceDetailScreen;
