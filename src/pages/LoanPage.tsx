import { useNavigate } from "react-router";
import { useCallback } from "react";
import { formatUnits, zeroAddress } from "viem";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useMagnifyWorld } from "@/hooks/useMagnifyWorld";
import useRequestLoan from "@/hooks/useRequestLoan";
import { MiniKit } from "@worldcoin/minikit-js";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/ui/badge";

const LoanPage = () => {
  // Hooks
  const navigate = useNavigate();
  const user = MiniKit?.user;
  const { data, isLoading, isError, refetch } = useMagnifyWorld(user?.walletAddress);
  const { requestNewLoan, error, transactionId, isConfirming, isConfirmed } = useRequestLoan();

  // state
  const nftInfo = data?.nftInfo || { tokenId: null, tier: null };
  const showAllTiers = !nftInfo.tokenId; // If there's no NFT, show all tiers

  // Handle loan application
  const handleApplyLoan = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (data?.nftInfo?.tokenId) {
        await requestNewLoan();
      } else {
        alert("Unable to apply for loan. Ensure you have a verified NFT.");
      }
    },
    [data, requestNewLoan],
  );

  // Handle claiming verified NFT
  const handleClaimVerifiedNFT = () => {
    alert("Please complete the verification process to claim a verified NFT.");
  };

  // Handle navigation after claiming loan
  const handleNavigateAfterTransaction = () => {
    refetch();
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  if (isLoading) return <div className="container mx-auto p-6 text-center">Loading...</div>;
  if (isError) return <div className="container mx-auto p-6 text-center">Error fetching data.</div>;
  return (
    <div className="container p-6 space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold text-center mb-6">Get a Loan</h1>
      <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="text-md text-center text-gray-500">
            {nftInfo.tokenId ? (
              <p>{nftInfo.tier?.message}</p>
            ) : (
              <>
                <p>You don't have an NFT yet.</p>
                <p>Claim one to start!</p>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleApplyLoan} className="space-y-6 my-0">
          <Card className="p-6 space-y-6 glass-card bg-opacity-50 border rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex flex-col items-center space-y-2">
              <h2 className="text-xl font-semibold text-center tracking-wide text-gray-800">
                Current Loan Eligibility
              </h2>
              {nftInfo?.tokenId && (
                <Badge
                  variant="secondary"
                  className={`${nftInfo?.tier?.verificationStatus?.color} flex items-center space-x-2 px-3 py-1 rounded-md`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{nftInfo?.tier?.verificationStatus?.description}</span>
                </Badge>
              )}
            </div>

            {/* Loan Terms */}
            <div className="space-y-6">
              {showAllTiers ? (
                Object.entries(data?.allTiers || {}).map(([tierId, tier]) => (
                  <div
                    key={tierId}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-base font-medium flex items-center space-x-2 ${tier.verificationStatus.color}`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{tier.verificationStatus.level}</span>
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Loan Amount:{" "}
                        <span className="font-medium text-gray-800">${formatUnits(tier.loanAmount, 6)}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Interest Rate:{" "}
                        <span className="font-medium text-gray-800">
                          {((tier?.interestRate || BigInt(0)) / BigInt(100)).toString()}%
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration:{" "}
                        <span className="font-medium text-gray-800">
                          {((tier.loanPeriod || BigInt(0)) / BigInt(60 * 24 * 60)).toString()} days
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Loan Amount:{" "}
                    <span className={`font-medium ${nftInfo.tier?.color}`}>
                      ${formatUnits(nftInfo.tier?.loanAmount || 0, 6)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Interest Rate:{" "}
                    <span className={`font-medium ${nftInfo.tier?.color}`}>
                      {((nftInfo.tier?.interestRate || BigInt(0)) / BigInt(100)).toString()}%
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration:{" "}
                    <span className={`font-medium ${nftInfo.tier?.color}`}>
                      {((nftInfo.tier?.loanPeriod || BigInt(0)) / BigInt(60 * 24 * 60)).toString()} days
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Change the button based on NFT verification status */}
          {nftInfo.tokenId ? (
            <Button type="submit" disabled={isConfirming || isConfirmed} className="w-full">
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : isConfirmed ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirmed
                </>
              ) : (
                "Apply Now"
              )}
            </Button>
          ) : (
            <Button type="button" onClick={handleClaimVerifiedNFT} className="w-full">
              Claim Verified NFT
            </Button>
          )}
        </form>

        {error && <p className="text-red-500">{error}</p>}
        {transactionId && (
          <div className="mt-4">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
              Transaction ID:{" "}
              <span title={transactionId}>
                {transactionId.slice(0, 10)}...{transactionId.slice(-10)}
              </span>
            </p>
            {isConfirming && <p>Confirming transaction...</p>}
            {isConfirmed && (
              <>
                <p>Transaction confirmed!</p>
                <Button type="button" onClick={handleNavigateAfterTransaction} className="mt-2 w-full">
                  View Loan Details
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoanPage;

/*
loading
<Card className="p-6 text-center space-y-6">
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-black animate-spin border-t-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-pulse text-black" />
      </div>
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">Processing Loan</h3>
      <p className="text-gray-600">Confirming transaction on WorldChain...</p>
    </div>
  </div>
</Card>
*/

/*
loan details
<Card className="p-6 text-center space-y-6">
  <div className="flex justify-center">
    <CheckCircle2 className="h-16 w-16 text-green-500" />
  </div>
  <div className="space-y-2">
    <h3 className="text-xl font-semibold">Loan Approved!</h3>
    <div className="space-y-1 text-gray-600">
      <p>Amount: $loanDetails.amount</p>
      <p>Duration: loanDetails.duration days</p>
      <p>APR: loanDetails.duration === 7 ? "1.5%" : "2%"</p>
      <p className="text-xs break-all mt-2">Transaction ID: loanDetails.transactionId</p>
    </div>
  </div>
  <Button onClick={() => navigate("/dashboard")} className="w-full">
    View Dashboard
  </Button>
</Card>
*/
