// import dateFormat, { masks } from "dateformat";

function GetTime(date) {
  var hours = parseInt(dateFormat(date, "hh"));
  var minutes = parseInt(dateFormat(date, "MM"));
  var ampm = hours >= 12 ? "AM" : "PM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const PdfCode = (gstNumber, gst, cess, billingName, billingAddress, items) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
            background-color: #f4f4f4;
        }
        .invoice-container {
            max-width: 700px;
            margin: auto;
            background: #fff;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        .header, .footer {
            text-align: center;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .section {
            margin-bottom: 15px;
            padding: 5px;
        }
        .flex-container {
            display: flex;
            justify-content: space-between;
        }
        .flex-container > div {
            width: 48%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background: #f8f8f8;
        }
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
                <p><strong>Invoice No:</strong> 1</p>
                <p><strong>Invoice Date:</strong> 10-01-2025</p>
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
                <th>Sr. No.</th>
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
            <tr>
                <td>1</td>
                <td>Clear Water 1 Ltr</td>
                <td>22011010</td>
                <td>2</td>
                <td>UNT</td>
                <td>110.17</td>
                <td>220.34</td>
                <td>9.0% (19.83)</td>
                <td>9.0% (19.83)</td>
                <td>260.00</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Clear Water 500ml</td>
                <td>22011010</td>
                <td>1</td>
                <td>UNT</td>
                <td>127.12</td>
                <td>127.12</td>
                <td>9.0% (11.44)</td>
                <td>9.0% (11.44)</td>
                <td>150.00</td>
            </tr>
        </table>
        
        <div class="section">
            <p><strong>Total Quantity:</strong> 3</p>
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

const style = `
    .container {
      margin : 15px;
      border : solid 2px #000
    }
`;

export { PdfCode };
