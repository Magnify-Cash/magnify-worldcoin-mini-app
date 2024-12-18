import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ArrowUpRight } from "lucide-react";

interface WalletDashboardProps {
  balance: number;
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
  onShowFundingOptions,
  onShowHelpGuide,
}: WalletDashboardProps) => {
  return (
    <div className="space-y-8 animate-fade-up">
      <div className="text-center space-y-8">
        <h2 className="text-6xl font-bold text-brand-text-primary">
          ${balance.toFixed(2)}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button 
            variant="secondary"
            className="bg-white/50 hover:bg-white/60 text-brand-text-primary font-medium py-6"
            onClick={onShowFundingOptions}
          >
            Buy
          </Button>
          <Button 
            variant="secondary"
            className="bg-white/50 hover:bg-white/60 text-brand-text-primary font-medium py-6"
          >
            Send
          </Button>
        </div>
        
        <Button 
          className="w-full bg-white/50 hover:bg-white/60 text-brand-text-primary font-medium py-6 mb-8"
          variant="secondary"
        >
          Get a Loan
        </Button>

        <div className="space-y-4">
          {TOKENS.map((token) => (
            <Card key={token.symbol} className="p-4 bg-white/50 hover:bg-white/60 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="text-left">
                    <h3 className="font-medium text-brand-text-primary">{token.name}</h3>
                    <p className="text-sm text-brand-text-secondary">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-brand-text-primary">${token.balance.toFixed(2)}</p>
                  <p className={`text-sm ${token.change >= 0 ? 'text-brand-success' : 'text-brand-error'}`}>
                    {token.change >= 0 ? '+' : ''}{token.change}%
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;