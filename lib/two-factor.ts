import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

export function generateTwoFactorSecret(email: string) {
  const secret = generateSecret();
  const otpauth = generateURI({
    issuer: "CapitalCore AI",
    label: email,
    secret,
  });
  return { secret, otpauth };
}

export async function generateTwoFactorQrDataUrl(otpauth: string) {
  return QRCode.toDataURL(otpauth);
}

export function verifyTwoFactorToken(secret: string, token: string) {
  return verifySync({
    secret,
    token: token.replace(/\s/g, ""),
    epochTolerance: 30,
  }).valid;
}
