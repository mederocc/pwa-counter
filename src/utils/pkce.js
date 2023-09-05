export const generateCodeVerifier = () => {
  const dec2hex = (dec) => {
    return ("0" + dec.toString(16)).substr(-2);
  };

  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => String.fromCharCode(byte)).join("");
};

const base64urlencode = (str) => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const generateCodeChallengeFromVerifier = async (v) => {
  const hashed = await sha256(v);
  const base64encoded = base64urlencode(hashed);
  return base64encoded;
};
