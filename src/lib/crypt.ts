function key(): Promise<CryptoKey> {
  const key = process.env.TOTP_KEY;
  if (!key) throw new Error("TOTP key is missing");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(text: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyAlg = await key();
  const encrypt = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    keyAlg,
    new TextEncoder().encode(text)
  );
  const b = new Uint8Array(encrypt);
  const out = `${Buffer.from(iv).toString("base64")}.${Buffer.from(b).toString("base64")}`;
  return out;
}

export async function decrypt(text: string): Promise<string> {
  const [iv64, enc64] = text.split(".");
  const iv = new Uint8Array(Buffer.from(iv64, "base64"));
  const enc = new Uint8Array(Buffer.from(enc64, "base64"));
  const keyAlg = await key();
  const dec = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, keyAlg, enc);
  return new TextDecoder().decode(dec);
}
