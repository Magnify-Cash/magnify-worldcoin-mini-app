import { VerificationStatus } from "../verification/VerificationStatus";
import { VerificationLevel } from "@/types/verification";

interface WalletBalanceProps {
  balance: number;
  verificationLevel: VerificationLevel;
}

export const WalletBalance = ({ balance, verificationLevel }: WalletBalanceProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
        <VerificationStatus level={verificationLevel} />
      </div>
      
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">
            ${balance.toFixed(2)}
          </h1>
        </div>
      </div>
    </div>
  );
};