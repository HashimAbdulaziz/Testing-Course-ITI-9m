async function sendOrderConfirmation(email, transactionId) {
  return { sent: true };
}

module.exports = { sendOrderConfirmation };
