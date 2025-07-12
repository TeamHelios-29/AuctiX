// File: components/delivery/shared/FormatHelper.tsx
export const formatCurrency = (amount: number = 0) => {
  return `LKR ${amount.toLocaleString()}`;
};
