import { Buffer } from "buffer";

globalThis.Buffer = Buffer;

if (typeof globalThis.process === "undefined") {
  Object.defineProperty(globalThis, "process", {
    configurable: true,
    value: { env: {} },
    writable: true,
  });
}
