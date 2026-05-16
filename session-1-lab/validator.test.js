const { isValidPassword } = require("./validator");

describe("isValidPassword", () => {
  test("strong password with 8+ chars, uppercase, and numbers passes", () => {
    const result = isValidPassword("Z3bola12345");
    expect(result).toEqual({ valid: true, reason: "" });
  });

  test("fails when the password is less than 8 characters", () => {
    const result = isValidPassword("Aa12345");
    expect(result).toEqual({ valid: false, reason: "Too short (min 8 characters)" });
  });

  test("fails when the password has no uppercase letter", () => {
    const result = isValidPassword("aa123456");
    expect(result).toEqual({ valid: false, reason: "Must contain an uppercase letter" });
  });

  test("fails when the password has no numbers", () => {
    const result = isValidPassword("Hashim#M");
    expect(result).toEqual({ valid: false, reason: "Must contain a number" });
  });

  test("fails when the password is not a string", () => {
    expect(isValidPassword(123456789)).toEqual({
      valid: false,
      reason: "Password must be a string",
    });

    expect(isValidPassword(null)).toEqual({
      valid: false,
      reason: "Password must be a string",
    });

    expect(isValidPassword(undefined)).toEqual({
      valid: false,
      reason: "Password must be a string",
    });
  });

  test("passes with the shortest possible valid password (exactly 8 chars)", () => {
    const result = isValidPassword("Z3bola78");
    expect(result).toEqual({ valid: true, reason: "" });
  });
});
