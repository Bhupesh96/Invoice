const PdfCode = (
  gstNumber,
  gst,
  cess,
  billingName,
  billingAddress,
  date,
  items,
  subtotal,
  gstAmount,
  cessAmount,
  invoiceNumber
) => {
  console.log("Received items:", items);

  let itemsRows = "";
  if (Array.isArray(items) && items.length > 0) {
    itemsRows = items
      .map((item) => {
        return `
        <tr>
          <td>${item.itemName}</td>
          <td>${item.hsn}</td>
          <td>${item.quantity}</td>
          <td>${item.unit}</td>
          <td>${item.price}</td>
          <td>${item.total}</td>
          <td>${(item.total * 0.09).toFixed(2)}</td>
          <td>${(item.total * 0.09).toFixed(2)}</td>
          <td>${(item.total + item.total * 0.18).toFixed(2)}</td>
        </tr>
      `;
      })
      .join("");
  } else {
    itemsRows = `
      <tr>
        <td colspan="9" style="text-align: center;">No items available</td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #f4f4f4; }
            .invoice-container { max-width: 700px; margin: auto; background: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); }
            .header, .footer { text-align: center; font-weight: bold; margin-bottom: 15px; }
            .section { margin-bottom: 15px; padding: 5px; }
            .flex-container { display: flex; justify-content: space-between; }
            .flex-container > div { width: 48%; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; }
            th { background: #f8f8f8; }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <h2>SHRI GOPAL FOODS, MINERAL WATER AND DAILY NEEDS</h2>
                <p>SHOP NO. 5 & 6 DHANORA, Bhilai, Durg, Chhattisgarh 491001</p>
                <p>GSTIN: 22MAGPS9796D1ZY</p>
            </div>
            
            <div class="flex-container">
                <div>
                    <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
                    <p><strong>Invoice Date:</strong> ${date}</p>
                    <p><strong>State:</strong> Chhattisgarh</p>
                </div>
                <div>
                    <h3>Details of Receiver | Billed to:</h3>
                    <p><strong>Name:</strong> ${billingName}</p>
                    <p><strong>Address:</strong> ${billingAddress}</p>
                    <p><strong>GSTIN:</strong> ${gstNumber}</p>
                </div>
            </div>
            
            <table>
                <tr>
                    <th>Product Name</th>
                    <th>HSN/SAC</th>
                    <th>QTY</th>
                    <th>Unit</th>
                    <th>Rate</th>
                    <th>Taxable Value</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Total</th>
                </tr>
                ${itemsRows}
            </table>
            
            <div class="section">
                <p><strong>Total Quantity:</strong> ${items.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}</p>
                <p><strong>Total Invoice Amount in Words:</strong> Four Hundred Ten Rupees Only</p>
            </div>
            
            <div class="section">
                <h3>Bank Details:</h3>
                <p><strong>Account Holder Name:</strong> Om Prakash Sinha</p>
                <p><strong>Bank Name:</strong> State Bank of India</p>
                <p><strong>Bank Branch Name:</strong> RISALI BHILAI</p>
                <p><strong>Account Number:</strong> 43721462571</p>
                <p><strong>IFSC Code:</strong> SBIN0012328</p>
            </div>
            
            <div class="footer">
                <p>Certified that the particulars given above are true and correct</p>
                <p>Authorized Signatory</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export { PdfCode };
