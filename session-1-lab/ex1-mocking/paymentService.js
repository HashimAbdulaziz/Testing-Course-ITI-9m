async function charge(userId, amount) {
  return { success: true, transactionId: "txn_live_abc123" };
}

module.exports = { charge };
