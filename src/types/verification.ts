export type VerificationLevel = "ORB" | "PASSPORT" | "NONE";

export interface VerificationTier {
  level: VerificationLevel;
  maxLoanAmount: number;
  description: string;
  color: string;
  availableAmounts: string[];
  message: string;
}

export const VERIFICATION_TIERS: Record<VerificationLevel, VerificationTier> = {
  ORB: {
    level: "ORB",
    maxLoanAmount: 10,
    description: "World ID ORB Verified",
    color: "text-brand-success",
    availableAmounts: ["1", "5", "10"],
    message: "You're fully verified and eligible for maximum loan amounts!",
  },
  PASSPORT: {
    level: "PASSPORT",
    maxLoanAmount: 3,
    description: "World ID Passport Verified",
    color: "text-brand-warning",
    availableAmounts: ["1", "5"],
    message: "Get ORB verified to unlock $10 loans!",
  },
  NONE: {
    level: "NONE",
    maxLoanAmount: 1,
    description: "Not Verified",
    color: "text-brand-error",
    availableAmounts: ["1"],
    message:
      "Get World ID verified to unlock higher loan amounts! Verify with Passport for $5 loans or get ORB verified for $10 loans.",
  },
};
