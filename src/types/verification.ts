export type VerificationLevel = 'ORB' | 'PASSPORT' | 'NONE';

export interface VerificationTier {
  level: VerificationLevel;
  maxLoanAmount: number;
  description: string;
  icon: string;
}

export interface VerificationStatus {
  currentLevel: VerificationLevel;
  isVerifying: boolean;
  error?: string;
}