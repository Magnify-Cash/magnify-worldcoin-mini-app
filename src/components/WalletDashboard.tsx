import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Clock, Wallet, HelpCircle } from "lucide-react";

interface WalletDashboardProps {
  balance: number;
  onShowFundingOptions: () => void;
  onShowHelpGuide: () => void;
}

const WalletDashboard = ({
  balance,
  onShowFundingOptions,
  onShowHelpGuide,
}: WalletDashboardProps) => {
  return (
    <div className="space-y-8 animate-fade-up">
      <div className="bg-gradient-to-r from-worldcoin-primary to-worldcoin-secondary p-6 rounded-lg text-white">
        <h3 className="text-xl font-semibold mb-2">Wallet Balance</h3>
        <p className="text-2xl font-bold">{balance.toFixed(2)} WUSDC</p>
      </div>
      
      <div className="grid gap-4">
        <Button 
          className="w-full" 
          size="lg"
          onClick={onShowFundingOptions}
        >
          <Wallet className="mr-2" /> Add Funds
        </Button>
        <Button className="w-full" variant="outline" size="lg">
          <DollarSign className="mr-2" /> Take Out a Loan
        </Button>
        <Button className="w-full" variant="outline" size="lg">
          <Clock className="mr-2" /> Track Repayments
        </Button>
        <Button 
          className="w-full" 
          variant="ghost" 
          size="lg"
          onClick={onShowHelpGuide}
        >
          <HelpCircle className="mr-2" /> Need Help?
        </Button>
      </div>
    </div>
  );
};

export default WalletDashboard;