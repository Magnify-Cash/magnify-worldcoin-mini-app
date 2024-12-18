import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerificationStatus } from "./verification/VerificationStatus";
import { VerificationLevel } from "@/types/verification";
import { useNavigate } from "react-router-dom";
import { Plus, Send, MoreHorizontal, ArrowDown, ArrowUp } from "lucide-react";

interface WalletDashboardProps {
  balance: number;
  verificationLevel: VerificationLevel;
  onShowFundingOptions: () => void;
  onShowHelpGuide: () => void;
}

const TOKENS = [
  { name: 'Worldcoin', symbol: 'WLD', balance: 16.24, change: -5.65, color: 'bg-gray-800' },
  { name: 'Dollars', symbol: 'USDC.E', balance: 0.00, change: 0.01, color: 'bg-green-500' },
  { name: 'Bitcoin', symbol: 'WBTC', balance: 0.00, change: -3.03, color: 'bg-orange-500' },
  { name: 'Ethereum', symbol: 'WETH', balance: 0.00, change: -3.46, color: 'bg-blue-500' },
];

const WalletDashboard = ({
  balance,
  verificationLevel,
  onShowFundingOptions,
  onShowHelpGuide,
}: WalletDashboardProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-up">
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
          
          <div className="grid grid-cols-3 gap-4">
            <Button 
              variant="outline"
              className="flex flex-col items-center gap-2 py-4 glass-card"
              onClick={onShowFundingOptions}
            >
              <Plus className="h-6 w-6" />
              <span>Buy</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center gap-2 py-4 glass-card"
            >
              <Send className="h-6 w-6" />
              <span>Send</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center gap-2 py-4 glass-card"
              onClick={onShowHelpGuide}
            >
              <MoreHorizontal className="h-6 w-6" />
              <span>More</span>
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {TOKENS.map((token) => (
            <Card 
              key={token.symbol}
              className="flex items-center justify-between p-4 glass-card"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${token.color} flex items-center justify-center`}>
                  <span className="text-white text-lg">{token.symbol[0]}</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">{token.name}</h3>
                  <p className="text-sm text-brand-text-secondary">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${token.balance.toFixed(2)}</p>
                <p className={`text-sm flex items-center gap-1 ${token.change >= 0 ? 'text-brand-success' : 'text-brand-error'}`}>
                  {token.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(token.change)}%
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;