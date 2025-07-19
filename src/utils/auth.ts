/**
 * Normalize Persian digits (۰–۹) to Latin (0–9).
 */
export function normalizeDigits(str: string): string {
  return str.replace(/[\u06F0-\u06F9]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0x06F0 + 48)
  );
}

/**
 * Generate a random numeric OTP of the given length.
 * Defaults to 4 digits: [1000..9999].
 */
export function generateOTP(length = 4): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}
