const { placeOrder } = require("./orderService");
const paymentService = require("./paymentService");
const emailService = require("./emailService");

jest.mock("./paymentService");
jest.mock("./emailService");

describe("orderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return orderId and transactionId on a valid order", async () => {
    paymentService.charge.mockResolvedValue({ success: true, transactionId: "txn_live_abc123" });
    emailService.sendOrderConfirmation.mockResolvedValue({ sent: true });

    const result = await placeOrder("user123", "test@example.com", 50);

    expect(result).toHaveProperty("orderId");
    expect(result.orderId).toMatch(/^order_\d+$/);
    expect(result).toHaveProperty("transactionId", "txn_live_abc123");
  });

  it("should call sendOrderConfirmation with the correct email and transactionId", async () => {
    paymentService.charge.mockResolvedValue({ success: true, transactionId: "txn_live_abc123" });
    emailService.sendOrderConfirmation.mockResolvedValue({ sent: true });

    await placeOrder("user123", "test@example.com", 50);

    expect(emailService.sendOrderConfirmation).toHaveBeenCalledWith(
      "test@example.com",
      "txn_live_abc123"
    );
  });

  it('should throw "Invalid amount" if amount is 0 and never call charge', async () => {
    await expect(placeOrder("user123", "test@example.com", 0)).rejects.toThrow("Invalid amount");

    expect(paymentService.charge).not.toHaveBeenCalled();
  });

  it('should throw "Payment failed" if charge fails, and never send an email', async () => {
    paymentService.charge.mockResolvedValue({ success: false });

    await expect(placeOrder("user123", "test@example.com", 50)).rejects.toThrow("Payment failed");

    expect(emailService.sendOrderConfirmation).not.toHaveBeenCalled();
  });
});
