export type VerificationLevel = 'ORB' | 'PASSPORT' | 'NONE';

export interface VerificationTier {
  level: VerificationLevel;
  maxLoanAmount: number;
  description: string;
  color: string;
}

export const VERIFICATION_TIERS: Record<VerificationLevel, VerificationTier> = {
  ORB: {
    level: 'ORB',
    maxLoanAmount: 10,
    description: 'World ID ORB Verified',
    color: 'text-brand-success'
  },
  PASSPORT: {
    level: 'PASSPORT',
    maxLoanAmount: 3,
    description: 'World ID Passport Verified',
    color: 'text-brand-warning'
  },
  NONE: {
    level: 'NONE',
    maxLoanAmount: 1,
    description: 'Not Verified',
    color: 'text-brand-error'
  }
};