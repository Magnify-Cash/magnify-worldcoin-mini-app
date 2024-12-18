import { useEffect, useState } from "react";
import { VerificationLevel } from "@/types/verification";
import { Card } from "@/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/ui/button";
import { Plus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VerificationStatus } from "@/components/verification/VerificationStatus";

interface WalletDashboardProps {
  balance: number;
  verificationLevel: VerificationLevel;
  onShowFundingOptions: () => void;
}

const WalletDashboard = ({
  balance,
  verificationLevel,
  onShowFundingOptions,
}: WalletDashboardProps) => {
  const navigate = useNavigate();

  const [tokens, setBalances] = useState([]);
  useEffect(() => {
    const url = `https://worldchain-mainnet.g.alchemy.com/v2/j-_GFK85PRHN59YaKb8lmVbV0LHmFGBL`;
    const address = "";
    const fetchBalances = async () => {
      try {
        const ethBalanceResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [address, "latest"], // "latest" for the latest block
            id: 1,
          }),
        });

        const ethBalanceResult = await ethBalanceResponse.json();
        const ethBalance = parseInt(ethBalanceResult.result, 16) / 1e18; // Convert from wei to ether

        const tokenBalancesResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            params: [address],
            id: 2,
          }),
        });

        const tokenBalancesResult = await tokenBalancesResponse.json();
        const tokenBalances = tokenBalancesResult.result.tokenBalances;
        console.log("ETH Balance:", ethBalance);
        console.log("Token Balances:", tokenBalancesResult);

        // Fetch metadata for each token
        const detailedBalances = await Promise.all(
          tokenBalances.map(async (token) => {
            const metadataResponse = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jsonrpc: "2.0",
                method: "alchemy_getTokenMetadata",
                params: [token.contractAddress],
                id: 1,
              }),
            });
            const metadata = await metadataResponse.json();

            return {
              contractAddress: token.contractAddress,
              balance: token.tokenBalance,
              symbol: metadata.result.symbol,
              decimals: metadata.result.decimals,
              name: metadata.result.name,
            };
          }),
        );

        // Combine native token balance with ERC-20 token tokens
        setBalances([
          {
            symbol: "ETH",
            name: "Ether",
            balance: ethBalance,
            decimals: 18,
            contractAddress: "0x0000000000000000000000000000000000000000", // Native token's pseudo address
          },
          ...detailedBalances,
        ]);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        setBalances([]); // Set to empty array on error
      }
    };

    if (address) {
      fetchBalances();
    }
  }, []);
  const randomTailwindColor = (char) => {
    const colors = ["red", "green", "blue", "indigo", "purple", "pink"];
    const colorIndex = char.charCodeAt(0) % colors.length;
    const color = colors[colorIndex];
    return `bg-${color}-300`;
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-up">
      {/* Wallet Balance */}
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
      {/* End Wallet Balance */}

      {/* Wallet Actions */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 w-24 h-24 glass-card"
          onClick={() => navigate("/loan")}
        >
          <Plus className="h-8 w-8" />
          <span>Get a loan</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 w-24 h-24 glass-card"
          onClick={() => navigate("/dashboard")}
        >
          <Send className="h-8 w-8" />
          <span>Dashboard</span>
        </Button>
      </div>
      {/* Wallet Actions */}

      {/* Token List */}
      <div className="space-y-4">
        {tokens.map((token) => (
          <Card
            key={token.symbol}
            className="flex items-center justify-between p-4 glass-card"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${randomTailwindColor(token.symbol[0])} flex items-center justify-center`}
              >
                <span className="text-white text-lg">{token.symbol[0]}</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold">{token.name}</h3>
                <p className="text-sm text-brand-text-secondary">
                  {token.symbol}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{token.balance}</p>
            </div>
          </Card>
        ))}
      </div>
      {/* End Token List */}
    </div>
  );
};

export default WalletDashboard;
