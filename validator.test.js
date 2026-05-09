const { isValidPassword } = require("./validator");

describe("isValidPassword", () => {
  test("Strong Password, have 8+length/uppercase/numbers", () => {
    const result = isValidPassword("Z3bola12345");

    expect(result).toEqual({ valid: true, reason: "" });
  });

  test("test fail when the password is less than 8 chars", () => {
    const result = isValidPassword("Aa12345");

    expect(result).toEqual({ valid: false, reason: "Too short (min 8 characters)" });
  });

  test("test fails when the password have no uppercase", () => {
    const result = isValidPassword("aa123456");

    expect(result).toEqual({ valid: false, reason: "Must contain an uppercase letter" });
  });

  test("test fails when the password have no numbers", () => {
    const result = isValidPassword("Hashim#M");

    expect(result).toEqual({ valid: false, reason: "Must contain a number" });
  });

  test("test fails when the password not a String", () => {
    expect(isValidPassword(123456789)).toEqual({
      valid: false,
      reason: "Password must be a string"
    });

    expect(isValidPassword(null)).toEqual({ valid: false, reason: "Password must be a string" });

    expect(isValidPassword(undefined)).toEqual({
      valid: false,
      reason: "Password must be a string"
    });
  });

  test("test passes when it shortest possible valid password", () => {
    const result = isValidPassword("Z3bola78");

    expect(result).toEqual({ valid: true, reason: "" });
  });
});
