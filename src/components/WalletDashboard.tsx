import { WalletBalance } from "./wallet/WalletBalance";
import { WalletActions } from "./wallet/WalletActions";
import { TokenList } from "./wallet/TokenList";
import { VerificationLevel } from "@/types/verification";

interface WalletDashboardProps {
  balance: number;
  verificationLevel: VerificationLevel;
  onShowFundingOptions: () => void;
  onShowHelpGuide: () => void;
}

const WalletDashboard = ({
  balance,
  verificationLevel,
  onShowFundingOptions,
  onShowHelpGuide,
}: WalletDashboardProps) => {
  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-up">
      <WalletBalance balance={balance} verificationLevel={verificationLevel} />
      <WalletActions 
        onShowFundingOptions={onShowFundingOptions} 
        onShowHelpGuide={onShowHelpGuide} 
      />
      <TokenList />
    </div>
  );
};

export default WalletDashboard;