import { useNavigate } from "react-router";
import { useState, useCallback } from "react";
import { formatUnits } from "viem";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useMagnifyWorld } from "@/hooks/useMagnifyWorld";
import useRequestLoan from "@/hooks/useRequestLoan";
import { MiniKit } from "@worldcoin/minikit-js";
import { VERIFICATION_TIERS } from "@/hooks/useMagnifyWorld";

const LoanPage = () => {
  // Hooks
  const navigate = useNavigate();
  const user = MiniKit?.user;
  const { data, isLoading, isError } = useMagnifyWorld(user?.walletAddress);
  const { requestNewLoan, error, transactionId, isConfirming, isConfirmed } = useRequestLoan();

  // Handle loan application
  const handleApplyLoan = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault(); // Prevent form from submitting traditionally

      if (data?.nftInfo?.tokenId) {
        await requestNewLoan();
      } else {
        // Handle the case where NFT token ID is not available or user isn't verified
        alert("Unable to apply for loan. Ensure you have a verified NFT.");
      }
    },
    [data, requestNewLoan],
  );

  // Handle claiming verified NFT
  const handleClaimVerifiedNFT = () => {
    alert("Please complete the verification process to claim a verified NFT.");
  };

  if (isLoading) return <div className="container mx-auto p-6 text-center">Loading...</div>;
  if (isError) return <div className="container mx-auto p-6 text-center">Error fetching data.</div>;

  // Null or undefined checks for data.nftInfo and tier
  const nftInfo = data?.nftInfo || { tokenId: null, tier: null };

  const showAllTiers = !nftInfo.tokenId; // If there's no NFT, show all tiers

  return (
    <div className="container p-6 space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold text-center mb-6">Get a Loan</h1>
      <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Apply for a Loan</h3>
          {/* If user has no tier (no NFT), show generic message */}
          <p className="text-sm text-gray-500">
            {nftInfo.tokenId
              ? nftInfo.tier?.message
              : "You don't have a verified NFT yet. Claim your NFT to start."}
          </p>
        </div>

        <form onSubmit={handleApplyLoan} className="space-y-6">
          <Card className="p-3 space-y-2 glass-card bg-opacity-50">
            <h3 className="font-medium text-sm text-brand-text-secondary">Loan Eligibility</h3>

            {/* Show all tiers if there's no verified NFT */}
            {showAllTiers ? (
              <div className="space-y-4">
                {Object.values(VERIFICATION_TIERS).map((verificationTier) => (
                  <div key={verificationTier.level} className="space-y-1">
                    <h4 className={`font-medium text-sm ${verificationTier.color}`}>
                      {verificationTier.level}
                    </h4>
                    <p className="text-sm text-brand-text-secondary">{verificationTier.message}</p>
                    <p className="text-sm text-brand-text-secondary">
                      Loan Amount:{" "}
                      <span className="font-medium">{`$${formatUnits(verificationTier.maxLoanAmount, 6)}`}</span>
                    </p>
                    <p className="text-sm text-brand-text-secondary">
                      Interest Rate:{" "}
                      <span className="font-medium">{`${verificationTier.maxLoanAmount}%`}</span>
                    </p>
                    <p className="text-sm text-brand-text-secondary">
                      Duration:{" "}
                      <span className="font-medium">{`${verificationTier.maxLoanAmount} days`}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-brand-text-secondary">
                  Loan Amount:{" "}
                  <span className={`ml-2 font-medium ${nftInfo.tier?.color}`}>
                    ${formatUnits(nftInfo.tier?.maxLoanAmount || 0, 6)}
                  </span>
                </p>
                <p className="text-sm text-brand-text-secondary">
                  Interest Rate:{" "}
                  <span className={`ml-2 font-medium ${nftInfo.tier?.color}`}>
                    {((nftInfo.tier?.interestRate || BigInt(0)) / BigInt(100)).toString()}%
                  </span>
                </p>
                <p className="text-sm text-brand-text-secondary">
                  Duration:{" "}
                  <span className={`ml-2 font-medium ${nftInfo.tier?.color}`}>
                    {((nftInfo.tier?.loanPeriod || BigInt(0)) / BigInt(60 * 24 * 60)).toString()} days
                  </span>
                </p>
                <p className="text-xs text-brand-text-secondary/80 my-10">
                  Based on your {nftInfo.tier?.description} status
                </p>
              </div>
            )}
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
            <p>Transaction ID: {transactionId}</p>
            {isConfirming && <p>Confirming transaction...</p>}
            {isConfirmed && <p>Transaction confirmed!</p>}
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
