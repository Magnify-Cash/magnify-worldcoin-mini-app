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
import { VerificationLevel, VERIFICATION_TIERS } from "@/types/verification";
import { useMagnifyWorld } from "@/hooks/useMagnifyWorld";

const LoanPage = () => {
  // State Management
  // =================
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loanDetails, setLoanDetails] = useState<any>();

  // Hooks
  // ============================
  const navigate = useNavigate();
  const { data } = useMagnifyWorld("0x7745B9B74a0C7637fa5B74d5Fc106118bdBB0eE7");

  // Constants
  // =========
  // These would typically come from an authentication context or environment variables
  console.log(data);
  const verificationLevel: VerificationLevel = "NONE";
  const tier = VERIFICATION_TIERS[verificationLevel];

  return (
    <div className="container p-6 space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold text-center mb-6">Get a Loan</h1>
      {isLoading ? (
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
      ) : loanDetails ? (
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
      ) : (
        <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Apply for a Loan</h3>
            <p className="text-sm text-gray-500">{tier.message}</p>
          </div>

          <form onSubmit={() => {}} className="space-y-6">
            <LoanEligibility level={verificationLevel} />

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
