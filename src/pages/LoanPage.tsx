import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { LoanEligibility } from "@/components/verification/LoanEligibility";
import useInitializeNewLoan from "@/hooks/useRequestLoan";
import { WORLDCOIN_NFT_COLLATERAL } from "@/utils/constants";
import { VerificationLevel, VERIFICATION_TIERS } from "@/types/verification";

const LoanPage = () => {
  // State Management
  // =================
  const [amount, setAmount] = useState<string>("1"); // Loan amount as string for input control
  const [duration, setDuration] = useState<string>("30"); // Loan duration in days as string

  // Hooks
  // ============================
  const { initializeNewLoan, isConfirming, isConfirmed, error, loanDetails } = useInitializeNewLoan();
  const navigate = useNavigate();

  // Constants
  // =========
  // These would typically come from an authentication context or environment variables
  const verificationLevel: VerificationLevel = "NONE";
  const tier = VERIFICATION_TIERS[verificationLevel];

  // Toasts
  // ========
  // Use effects for toast notifications
  useEffect(() => {
    if (error) {
      toast.error(`Failed to apply for loan: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Loan application successful!");
    }
  }, [isConfirmed]);

  // Loan Handler
  // ==============
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const numAmount = Number(amount);
      if (numAmount > tier.maxLoanAmount) {
        toast.error(`Maximum loan amount is $${tier.maxLoanAmount}`);
        return;
      }

      try {
        // Convert string inputs to BigInt for smart contract interaction
        const lendingDeskId = 1;
        const nftCollection = WORLDCOIN_NFT_COLLATERAL;
        const nftId = BigInt(1234);
        const durationBigInt = parseInt(duration);
        const amountBigInt = BigInt(numAmount * 1e18);
        const maxInterestAllowed = 5;

        // Initialize loan using the custom hook which interfaces with the blockchain
        await initializeNewLoan(
          lendingDeskId,
          nftCollection,
          nftId,
          durationBigInt,
          amountBigInt,
          maxInterestAllowed,
        );
      } catch (err) {
        // Error handling for the loan initialization process
        console.error("Error in loan application:", err);
      }
    },
    [amount, duration, initializeNewLoan, error],
  );

  return (
    <div className="container p-6 space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold text-center mb-6">Get a Loan</h1>
      <LoanEligibility level={verificationLevel} />

      {isConfirming ? (
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
      ) : isConfirmed && loanDetails ? (
        <Card className="p-6 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Loan Approved!</h3>
            <div className="space-y-1 text-gray-600">
              <p>Amount: ${loanDetails.amount}</p>
              <p>Duration: {loanDetails.duration} days</p>
              <p>APR: {loanDetails.duration === 7 ? "1.5%" : "2%"}</p>
              <p className="text-xs break-all mt-2">Transaction ID: {loanDetails.transactionId}</p>
            </div>
          </div>
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            View Dashboard
          </Button>
        </Card>
      ) : (
        <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Apply for a Loan</h3>
            <p className="text-sm text-gray-500">{tier.message}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount ($)</Label>
              <Select value={amount} onValueChange={setAmount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  {tier.availableAmounts.map((value) => (
                    <SelectItem key={value} value={value}>
                      ${value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loan Duration</Label>
              <RadioGroup value={duration} onValueChange={setDuration}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="30days" />
                  <Label htmlFor="30days">30 Days (1.5% APR)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="60days" />
                  <Label htmlFor="60days">60 Days (2% APR)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90" id="90days" />
                  <Label htmlFor="90days">90 Days (2.5% APR)</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
              Apply Now
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default LoanPage;
