export const PLATFORM_FEE = 50;

export type PaymentMethod = 'GCASH' | 'MAYA' | 'BANK_TRANSFER' | 'CREDIT_CARD';

export const GATEWAY_FEES: Record<PaymentMethod, { percentage: number; flat: number; label: string }> = {
  GCASH: { percentage: 0.025, flat: 0, label: "GCash" },
  MAYA: { percentage: 0.02, flat: 0, label: "Maya" },
  BANK_TRANSFER: { percentage: 0, flat: 25, label: "Bank Transfer" },
  CREDIT_CARD: { percentage: 0.035, flat: 15, label: "Credit/Debit Card" },
};

export function calculateTotalFee(basePrice: number, paymentMethod: PaymentMethod) {
  const subtotal = basePrice + PLATFORM_FEE;
  const gatewayFeeConfig = GATEWAY_FEES[paymentMethod];
  
  // Custom Fee Logic: Base + Platform + Dynamic Gateway
  const gatewayFee = (subtotal * gatewayFeeConfig.percentage) + gatewayFeeConfig.flat;
  const total = subtotal + gatewayFee;

  return {
    basePrice,
    platformFee: PLATFORM_FEE,
    gatewayFee: Number(gatewayFee.toFixed(2)),
    total: Number(total.toFixed(2))
  };
}
