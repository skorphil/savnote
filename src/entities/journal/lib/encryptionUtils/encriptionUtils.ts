// import type { EncryptionSchema } from "@/shared/journal-schema";

// export async function createEncryptionKey(baseKey: string) {
//   const salt = window.crypto.getRandomValues(new Uint8Array(16));
//   const iv = window.crypto.getRandomValues(new Uint8Array(12));
//   const encryptionMeta: EncryptionSchema = {
//     derivationAlgorithmName: { name: "PBKDF2", hash: "SHA-256" },
//     derivedKeyAlgorithm: { name: "AES-GCM", length: 256 },
//     iterations: Math.floor(Math.random() * (150000 - 100000 + 1)) + 100000,
//     salt: uint8ArrayToBase64(iv),
//     iv: uint8ArrayToBase64(salt),
//   };
//   const encryptionKey = await deriveKey({ baseKey, ...encryptionMeta });
//   return {
//     encryptionKey,
//     encryptionMeta,
//   };
// }

// type DeriveKeyProps = EncryptionSchema & {
//   baseKey: string;
// };
// export async function deriveKey(props: DeriveKeyProps) {
//   const {
//     baseKey,
//     derivedKeyAlgorithm,
//     iterations,
//     salt,
//     derivationAlgorithm,
//   } = props;
//   const encoder = new TextEncoder();
//   const keyMaterial = await window.crypto.subtle.importKey(
//     "raw",
//     encoder.encode(baseKey),
//     { name: derivationAlgorithm.name },
//     false,
//     ["deriveKey"]
//   );
//   return await window.crypto.subtle.deriveKey(
//     {
//       name: derivationAlgorithm.name,
//       salt: base64ToUint8Array(salt),
//       iterations,
//       hash: derivedKeyAlgorithm.name,
//     },
//     keyMaterial,
//     { name: derivedKeyAlgorithm.name, length: derivedKeyAlgorithm.length },
//     false,
//     ["encrypt", "decrypt"]
//   );
// }

// export function uint8ArrayToBase64(uint8Array: Uint8Array) {
//   return btoa(String.fromCharCode(...uint8Array));
// }

// export function base64ToUint8Array(string: string) {
//   return new Uint8Array(
//     atob(string)
//       .split("")
//       .map((c) => c.charCodeAt(0))
//   );
// }
