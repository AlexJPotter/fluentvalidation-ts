export const formatNumber = (value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: 20 });
