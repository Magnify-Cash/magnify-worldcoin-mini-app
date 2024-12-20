import { useNavigate } from "react-router";
import { useState } from "react";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useMagnifyWorld } from "@/hooks/useMagnifyWorld";

const LoanPage = () => {
  // State Management
  // =================
  const [loanDetails, setLoanDetails] = useState<any>();

  // Hooks
  // ============================
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMagnifyWorld("0x7745B9B74a0C7637fa5B74d5Fc106118bdBB0eE7");

  // Constants
  // =========
  // These would typically come from an authentication context or environment variables
  if (isLoading) return <div className="container mx-auto p-6 text-center">Loading...</div>;
  if (isError) return <div className="container mx-auto p-6 text-center">Error fetching data.</div>;
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
            <p className="text-sm text-gray-500">{data?.nftInfo.tier.verificationStatus.message}</p>
          </div>

          <form onSubmit={() => {}} className="space-y-6">
            <Card className="p-3 space-y-2 glass-card bg-opacity-50">
              <h3 className="font-medium text-sm text-brand-text-secondary">Loan Eligibility</h3>
              <div className="space-y-1">
                <p className="text-sm text-brand-text-secondary">
                  Maximum loan amount:
                  <span className={`ml-2 font-medium ${data?.nftInfo.tier.verificationStatus.color}`}>
                    ${data?.nftInfo.tier.loanAmount.toString()}
                  </span>
                </p>
                <p className="text-xs text-brand-text-secondary/80">
                  Based on your {data?.nftInfo.tier.verificationStatus.description} status
                </p>
              </div>
            </Card>
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
