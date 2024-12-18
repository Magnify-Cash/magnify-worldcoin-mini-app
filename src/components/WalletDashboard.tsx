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
      <Card className="p-8 bg-modern-card backdrop-blur-sm shadow-glass border border-white/20">
        <div className="space-y-6">
          <div className="bg-purple-gradient p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Wallet Balance</h3>
            <p className="text-3xl font-bold text-white">{balance.toFixed(2)} WUSDC</p>
          </div>
          
          <div className="grid gap-4">
            <Button 
              className="w-full bg-modern-purple hover:bg-modern-purple/90 text-white" 
              size="lg"
              onClick={onShowFundingOptions}
            >
              <Wallet className="mr-2" /> Add Funds
            </Button>
            <Button 
              className="w-full bg-modern-blue hover:bg-modern-blue/90 text-white" 
              size="lg"
            >
              <DollarSign className="mr-2" /> Take Out a Loan
            </Button>
            <Button 
              className="w-full bg-modern-purple/10 hover:bg-modern-purple/20 text-modern-purple" 
              size="lg"
            >
              <Clock className="mr-2" /> Track Repayments
            </Button>
            <Button 
              className="w-full border-2 border-modern-purple/20 hover:bg-modern-purple/5" 
              variant="outline" 
              size="lg"
              onClick={onShowHelpGuide}
            >
              <HelpCircle className="mr-2" /> Need Help?
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletDashboard;