function isValidPassword(password) {
  if (typeof password !== "string") {
    return { valid: false, reason: "Password must be a string" };
  }

  if (password.length < 8) {
    return { valid: false, reason: "Too short (min 8 characters)" };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: "Must contain an uppercase letter" };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: "Must contain a number" };
  }

  return { valid: true, reason: "" };
}

module.exports = { isValidPassword };
