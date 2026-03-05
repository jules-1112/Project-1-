const salePriceEl = document.getElementById("salePrice");
const commissionRateEl = document.getElementById("commissionRate");
const brokerSplitEl = document.getElementById("brokerSplit");

const agentCommissionEl = document.getElementById("agentCommission");
const brokerTakeEl = document.getElementById("brokerTake");
const netIncomeEl = document.getElementById("netIncome");
const errorMsgEl = document.getElementById("errorMsg");

document.getElementById("calcBtn").addEventListener("click", calculate);
document.getElementById("exportBtn").addEventListener("click", exportToPDF);

function formatMoney(value) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function calculate() {
  errorMsgEl.textContent = "";

  const salePrice = Number(salePriceEl.value);
  const commissionRatePct = Number(commissionRateEl.value);
  const brokerSplitPct = Number(brokerSplitEl.value);

  if (!Number.isFinite(salePrice) || salePrice <= 0) {
    errorMsgEl.textContent = "Please enter a valid sale price greater than 0.";
    return;
  }
  if (!Number.isFinite(commissionRatePct) || commissionRatePct < 0) {
    errorMsgEl.textContent = "Commission rate must be 0 or higher.";
    return;
  }
  if (!Number.isFinite(brokerSplitPct) || brokerSplitPct < 0 || brokerSplitPct > 100) {
    errorMsgEl.textContent = "Broker split must be between 0 and 100.";
    return;
  }

  const commissionRate = commissionRatePct / 100;
  const brokerSplit = brokerSplitPct / 100;

  const agentCommission = salePrice * commissionRate;
  const brokerTake = agentCommission * brokerSplit;
  const netIncome = agentCommission - brokerTake;

  agentCommissionEl.textContent = formatMoney(agentCommission);
  brokerTakeEl.textContent = formatMoney(brokerTake);
  netIncomeEl.textContent = formatMoney(netIncome);
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Check if calculations have been made
  if (agentCommissionEl.textContent === "$0.00") {
    alert("Please calculate first before exporting.");
    return;
  }

  const salePrice = Number(salePriceEl.value);
  const commissionRate = Number(commissionRateEl.value);
  const brokerSplit = Number(brokerSplitEl.value);

  // Set up PDF styling
  doc.setFontSize(16);
  doc.text("Commission Calculation Report", 20, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  let yPos = 40;

  // Add input data
  doc.text("Inputs:", 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  doc.text(`Sale Price: ${formatMoney(salePrice)}`, 20, yPos);
  yPos += 8;
  doc.text(`Commission Rate: ${commissionRate}%`, 20, yPos);
  yPos += 8;
  doc.text(`Broker Split: ${brokerSplit}%`, 20, yPos);
  yPos += 15;

  // Add results
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text("Results:", 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Agent Commission: ${agentCommissionEl.textContent}`, 20, yPos);
  yPos += 8;
  doc.text(`Broker Split: ${brokerTakeEl.textContent}`, 20, yPos);
  yPos += 8;
  doc.text(`Net Income: ${netIncomeEl.textContent}`, 20, yPos);
  
  // Add timestamp
  yPos += 15;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPos);

  // Save the PDF
  doc.save("commission-calculation.pdf");
}

// Bonus: calculate on Enter key in sale price field
salePriceEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculate();
});