const { fetchWithRetry } = require("./fetchWithRetry");
const apiClient = require("./apiClient");

jest.mock("./apiClient");

describe("fetchWithRetry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns data on the first try and only calls getData once", async () => {
    apiClient.getData.mockResolvedValueOnce({ id: 1, name: "Test Data" });

    const result = await fetchWithRetry("https://api.example.com/data");

    expect(result).toEqual({ id: 1, name: "Test Data" });
    expect(apiClient.getData).toHaveBeenCalledTimes(1);
  });

  it("retries after a failure and returns data on the second attempt", async () => {
    apiClient.getData
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValueOnce({ id: 2, name: "Retry Success" });

    const result = await fetchWithRetry("https://api.example.com/data");

    expect(result).toEqual({ id: 2, name: "Retry Success" });
    expect(apiClient.getData).toHaveBeenCalledTimes(2);
  });

  it("throws after all 3 attempts fail and getData was called 3 times", async () => {
    apiClient.getData
      .mockRejectedValueOnce(new Error("Timeout 1"))
      .mockRejectedValueOnce(new Error("Timeout 2"))
      .mockRejectedValueOnce(new Error("Timeout 3"));

    await expect(
      fetchWithRetry("https://api.example.com/data")
    ).rejects.toThrow("Failed after 3 attempts: Timeout 3");

    expect(apiClient.getData).toHaveBeenCalledTimes(3);
  });

  it("throws after exactly 1 call when maxRetries is set to 1", async () => {
    apiClient.getData.mockRejectedValueOnce(new Error("Fatal Server Error"));

    await expect(
      fetchWithRetry("https://api.example.com/data", 1)
    ).rejects.toThrow("Failed after 1 attempts: Fatal Server Error");

    expect(apiClient.getData).toHaveBeenCalledTimes(1);
  });
});
