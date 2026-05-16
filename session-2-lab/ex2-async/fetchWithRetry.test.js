const { fetchWithRetry } = require("./fetchWithRetry");
const apiClient = require("./apiClient");

jest.mock("./apiClient");

describe("fetchWithRetry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return data and call getData once if the first attempt succeeds", async () => {
    apiClient.getData.mockResolvedValueOnce({ id: 1, name: "Test Data" });

    const result = await fetchWithRetry("https://api.example.com/data");

    expect(result).toEqual({ id: 1, name: "Test Data" });
    expect(apiClient.getData).toHaveBeenCalledTimes(1);
  });

  it("should call getData exactly twice if the first attempt fails but the second succeeds", async () => {
    apiClient.getData
      .mockRejectedValueOnce(new Error("Network Error"))
      .mockResolvedValueOnce({ id: 2, name: "Retry Success" });

    const result = await fetchWithRetry("https://api.example.com/data");

    expect(result).toEqual({ id: 2, name: "Retry Success" });
    expect(apiClient.getData).toHaveBeenCalledTimes(2);
  });

  it("should throw a failure error and call getData 3 times if all 3 attempts fail", async () => {
    apiClient.getData
      .mockRejectedValueOnce(new Error("Timeout 1"))
      .mockRejectedValueOnce(new Error("Timeout 2"))
      .mockRejectedValueOnce(new Error("Timeout 3"));

    await expect(fetchWithRetry("https://api.example.com/data")).rejects.toThrow(
      "Failed after 3 attempts: Timeout 3"
    );
    expect(apiClient.getData).toHaveBeenCalledTimes(3);
  });

  it("should throw after exactly 1 call if maxRetries is 1 and the mock fails", async () => {
    apiClient.getData.mockRejectedValueOnce(new Error("Fatal Server Error"));

    await expect(fetchWithRetry("https://api.example.com/data", 1)).rejects.toThrow(
      "Failed after 1 attempts: Fatal Server Error"
    );
    expect(apiClient.getData).toHaveBeenCalledTimes(1);
  });
});
