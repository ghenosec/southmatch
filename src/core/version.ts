/**
 * Versões do motor.
 *
 * DATA_FORMAT_VERSION: muda quando o contrato de dados (types/) muda
 * de forma incompatível. Temas declaram qual versão seguem.
 *
 * ALGORITHM_VERSION: muda quando qualquer fórmula muda o resultado
 * numérico para as mesmas entradas. Links compartilhados guardam
 * esta versão para não recalcular resultados antigos em silêncio.
 */
export const DATA_FORMAT_VERSION = 1;
export const ALGORITHM_VERSION = 1;
