import { sign } from 'tweetnacl';

export function verifyTelnyxSignature({
  signatureB64,
  timestamp,
  rawBody,
}: {
  signatureB64: string;
  timestamp: string;
  rawBody: string;
}): boolean {
  try {
    if (!signatureB64 || !timestamp || !rawBody) {
      return false;
    }

    const publicKeyB64 = process.env.TELNYX_PUBLIC_KEY;
    if (!publicKeyB64) {
      console.warn('TELNYX_PUBLIC_KEY not found in environment');
      return false;
    }

    const publicKey = Buffer.from(publicKeyB64, 'base64');
    const message = Buffer.from(`${timestamp}|${rawBody}`);
    const signature = Buffer.from(signatureB64, 'base64');

    return sign.detached.verify(message, signature, publicKey);
  } catch (error) {
    console.error('Error verifying Telnyx signature:', error);
    return false;
  }
}