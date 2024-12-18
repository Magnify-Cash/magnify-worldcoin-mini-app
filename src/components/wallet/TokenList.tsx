import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

const TOKENS = [
  { name: 'Worldcoin', symbol: 'WLD', balance: 16.24, change: -5.65, color: 'bg-gray-800' },
  { name: 'Dollars', symbol: 'USDC.E', balance: 0.00, change: 0.01, color: 'bg-green-500' },
  { name: 'Bitcoin', symbol: 'WBTC', balance: 0.00, change: -3.03, color: 'bg-orange-500' },
  { name: 'Ethereum', symbol: 'WETH', balance: 0.00, change: -3.46, color: 'bg-blue-500' },
];

export const TokenList = () => {
  return (
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
  );
};