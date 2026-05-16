const { charge } = require("./paymentService");
const { sendOrderConfirmation } = require("./emailService");

async function placeOrder(userId, email, amount) {
  if (amount <= 0) throw new Error("Invalid amount");

  const result = await charge(userId, amount);
  if (!result.success) throw new Error("Payment failed");

  await sendOrderConfirmation(email, result.transactionId);
  return { orderId: `order_${Date.now()}`, transactionId: result.transactionId };
}

module.exports = { placeOrder };
