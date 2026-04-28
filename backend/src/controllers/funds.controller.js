const Funds = require("../models/funds.model");

async function getAllFunds(req, res) {
  try {
    const funds = await Funds.find({ isActive: true })
      .populate("createdBy", "fullName email position")
      .sort({ date: -1 });

    return res.json({
      success: true,
      data: funds,
    });
  } catch (error) {
    console.error("Get Funds Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch funds",
    });
  }
}

async function getFundsSummary(req, res) {
  try {
    const funds = await Funds.find({ isActive: true });

    const summary = {
      totalAmount: funds.reduce((sum, fund) => sum + fund.amount, 0),
      totalTransactions: funds.length,
      byPaymentMode: {},
    };

    funds.forEach((fund) => {
      const mode = fund.paymentMode;
      summary.byPaymentMode[mode] = (summary.byPaymentMode[mode] || 0) + fund.amount;
    });

    return res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Get Funds Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch funds summary",
    });
  }
}

async function createFund(req, res) {
  try {
    const { date, items, paidBy, paidTo, paymentMode, amount, remark } = req.body;

    // Validation
    if (!date || !items || !paidBy || !paidTo || !amount) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Check if admin is set
    if (!req.admin || !req.admin._id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admin not found in request",
      });
    }

    const fund = await Funds.create({
      date: new Date(date),
      items,
      paidBy,
      paidTo,
      paymentMode: paymentMode || "cash",
      amount: parseFloat(amount),
      remark: remark || "",
      createdBy: req.admin._id,
    });

    await fund.populate("createdBy", "fullName email position");

    return res.status(201).json({
      success: true,
      message: "Fund entry created successfully",
      data: fund,
    });
  } catch (error) {
    console.error("Create Fund Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create fund entry",
      error: error.message,
    });
  }
}

async function updateFund(req, res) {
  try {
    const { id } = req.params;
    const { date, items, paidBy, paidTo, paymentMode, amount, remark } = req.body;

    const fund = await Funds.findById(id);

    if (!fund) {
      return res.status(404).json({
        success: false,
        message: "Fund entry not found",
      });
    }

    if (date) fund.date = new Date(date);
    if (items) fund.items = items;
    if (paidBy) fund.paidBy = paidBy;
    if (paidTo) fund.paidTo = paidTo;
    if (paymentMode) fund.paymentMode = paymentMode;
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than 0",
        });
      }
      fund.amount = amount;
    }
    if (remark !== undefined) fund.remark = remark;

    await fund.save();
    await fund.populate("createdBy", "fullName email position");

    return res.json({
      success: true,
      message: "Fund entry updated successfully",
      data: fund,
    });
  } catch (error) {
    console.error("Update Fund Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update fund entry",
    });
  }
}

async function deleteFund(req, res) {
  try {
    const { id } = req.params;

    const fund = await Funds.findById(id);

    if (!fund) {
      return res.status(404).json({
        success: false,
        message: "Fund entry not found",
      });
    }

    fund.isActive = false;
    await fund.save();

    return res.json({
      success: true,
      message: "Fund entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete Fund Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete fund entry",
    });
  }
}

async function generateInvoice(req, res) {
  try {
    const funds = await Funds.find({ isActive: true }).sort({ date: -1 });

    const totalAmount = funds.reduce((sum, fund) => sum + fund.amount, 0);

    let invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>IFPC Funds Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
          }
          header {
            text-align: center;
            border-bottom: 2px solid #1db954;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 {
            margin: 0;
            color: #050705;
          }
          .subtitle {
            color: #666;
            margin: 5px 0;
          }
          .summary {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
          }
          .summary-item {
            flex: 1;
          }
          .summary-label {
            font-size: 12px;
            color: #999;
            text-transform: uppercase;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #1db954;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background: #050705;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 13px;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #eee;
          }
          tr:hover {
            background: #f9f9f9;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .amount {
            text-align: right;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>IFPC Funds Management</h1>
            <p class="subtitle">Financial Invoice Report</p>
            <p class="subtitle">Generated on ${new Date().toLocaleString()}</p>
          </header>
          
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Total Amount</div>
              <div class="summary-value">₹${totalAmount.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Transactions</div>
              <div class="summary-value">${funds.length}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Paid By</th>
                <th>Paid To</th>
                <th>Mode</th>
                <th>Remark</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${funds
                .map(
                  (fund) => `
                <tr>
                  <td>${new Date(fund.date).toLocaleDateString()}</td>
                  <td>${fund.items}</td>
                  <td>${fund.paidBy}</td>
                  <td>${fund.paidTo}</td>
                  <td>${fund.paymentMode}</td>
                  <td>${fund.remark}</td>
                  <td class="amount">₹${fund.amount.toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>This is an auto-generated financial report from IFPC Portal</p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="IFPC_Funds_Invoice_${new Date().getTime()}.html"`
    );

    return res.send(invoiceHTML);
  } catch (error) {
    console.error("Generate Invoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
    });
  }
}

module.exports = {
  getAllFunds,
  getFundsSummary,
  createFund,
  updateFund,
  deleteFund,
  generateInvoice,
};
