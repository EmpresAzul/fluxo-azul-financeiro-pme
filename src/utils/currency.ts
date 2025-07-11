/**
 * Formata número para exibição com separadores de milhares
 */
export const formatNumberToDisplay = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata valor monetário para exibição em Real brasileiro
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Converte string para número removendo formatação
 */
export const parseNumberFromString = (value: string): number => {
  const cleanValue = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};