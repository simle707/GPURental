const CONFIG = {
  	CNY_TO_USD: 0.14,
  	BYTES_TO_GB: 1024 ** 3,
} as const;

export const toUSD = (rmb: number): number => {
  	return (rmb || 0) * CONFIG.CNY_TO_USD;
};

export const toGB = (bytes: number): number => {
  	if (!bytes || bytes <= 0) return 0;
	return bytes / CONFIG.BYTES_TO_GB;
};

export const formatCurrency = (amount: number, currency: '$' = '$'): string => {
  	return `${currency}${amount.toFixed(2)}`;
};