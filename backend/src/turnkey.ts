// turnkey.ts
import { Turnkey } from "@turnkey/sdk-server";

let _turnkey: Turnkey | null = null;

export function getTurnkey() {
  if (!_turnkey) {
    _turnkey = new Turnkey({
      apiBaseUrl: "https://api.turnkey.com",
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
      defaultOrganizationId: process.env.TURNKEY_ORG_ID!,
    });
  }
  return _turnkey;
}