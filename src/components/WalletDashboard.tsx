import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerificationStatus } from "./verification/VerificationStatus";
import { VerificationLevel } from "@/types/verification";
import { useNavigate } from "react-router-dom";
import { Wallet, Send, Plus } from "lucide-react";

interface WalletDashboardProps {
  balance: number;
  verificationLevel: VerificationLevel;
  onShowFundingOptions: () => void;
  onShowHelpGuide: () => void;
}

const TOKENS = [
  { name: 'Worldcoin', symbol: 'WLD', balance: 16.24, change: -5.65 },
  { name: 'Dollars', symbol: 'USDC.E', balance: 0.00, change: 0.01 },
  { name: 'Bitcoin', symbol: 'WBTC', balance: 0.00, change: -3.03 },
  { name: 'Ethereum', symbol: 'WETH', balance: 0.00, change: -3.46 },
];

const WalletDashboard = ({
  balance,
  verificationLevel,
  onShowFundingOptions,
  onShowHelpGuide,
}: WalletDashboardProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="text-center space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Wallet</h2>
          <VerificationStatus level={verificationLevel} />
        </div>
        
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            <Card className="glass-card p-6 w-48">
              <Wallet className="w-8 h-8 mb-2 text-brand-turquoise" />
              <p className="text-sm text-brand-text-secondary">Total Balance</p>
              <h3 className="text-2xl font-bold">${balance.toFixed(2)}</h3>
            </Card>
            
            {TOKENS.map((token) => (
              <Card 
                key={token.symbol} 
                className="glass-card p-6 w-48"
              >
                <div className="w-8 h-8 rounded-full bg-brand-skyBlue/50 mb-2" />
                <p className="text-sm text-brand-text-secondary">{token.name}</p>
                <h3 className="text-2xl font-bold">${token.balance.toFixed(2)}</h3>
                <p className={`text-sm ${token.change >= 0 ? 'text-brand-success' : 'text-brand-error'}`}>
                  {token.change >= 0 ? '+' : ''}{token.change}%
                </p>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="glass-card primary-button"
            onClick={onShowFundingOptions}
          >
            <Plus className="w-4 h-4" />
            Buy
          </Button>
          <Button 
            className="glass-card primary-button"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
        
        <Button 
          className="w-full glass-card primary-button py-6"
          onClick={() => navigate('/loan')}
        >
          Get a Loan
        </Button>
      </div>
    </div>
  );
};

export default WalletDashboard;