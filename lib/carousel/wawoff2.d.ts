declare module "wawoff2" {
  /**
   * Decompresses a WOFF2 font into a TTF. Returns a Uint8Array of TTF bytes.
   * The function is async because it relies on a WebAssembly module that
   * is lazily compiled on first call.
   */
  export function decompress(input: Uint8Array | ArrayBuffer): Promise<Uint8Array>;
  /**
   * Compresses a TTF font into WOFF2 (not used in our pipeline but exported
   * by the package).
   */
  export function compress(input: Uint8Array | ArrayBuffer): Promise<Uint8Array>;
}
