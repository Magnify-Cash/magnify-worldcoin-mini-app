import { VerificationStatus } from "../verification/VerificationStatus";
import { VerificationLevel } from "@/types/verification";

interface WalletBalanceProps {
  balance: number;
  verificationLevel: VerificationLevel;
}

export const WalletBalance = ({ balance, verificationLevel }: WalletBalanceProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Wallet</h2>
        <VerificationStatus level={verificationLevel} />
      </div>
      
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">
            ${balance.toFixed(2)}
          </h1>
        </div>
      </div>
    </div>
  );
};