/**
 * Motor de personalidade — API pública.
 *
 * Regras: sem React, sem navegador, sem temas, sem rede.
 * Apenas funções puras sobre os contratos de `types/`.
 */
export * from "./types";
export * from "./version";
export * from "./errors";
export * from "./scoring";
export * from "./affinity";
export * from "./ranking";
export * from "./interpretation";
export * from "./validation";
export * from "./engine";
export { round, clamp } from "./math";
