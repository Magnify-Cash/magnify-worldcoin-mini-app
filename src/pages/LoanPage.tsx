import { useState } from "react";
import { Card } from "@/ui/card";
import { toast } from "sonner";
import LoanApplicationForm from "@/components/loan/LoanApplicationForm";
import LoanConfirmation from "@/components/loan/LoanConfirmation";
import { LoanEligibility } from "@/components/verification/LoanEligibility";
import { VerificationLevel } from "@/types/verification";

const LoanPage = () => {
  const [currentStep, setCurrentStep] = useState<"application" | "confirmation">("application");
  const [loanDetails, setLoanDetails] = useState<{
    amount: number;
    duration: number;
    transactionId: string;
  } | null>(null);

  // This would come from your auth context in a real app
  const verificationLevel: VerificationLevel = "NONE";

  const handleLoanApplication = (amount: number, duration: number) => {
    console.log("Processing loan application:", { amount, duration });
    // Here we would integrate with smart contract
    const mockTransactionId = "0x" + Math.random().toString(16).substr(2, 40);
    setLoanDetails({
      amount,
      duration,
      transactionId: mockTransactionId,
    });
    setCurrentStep("confirmation");
    toast.success("Loan application successful!");
  };

  return (
    <div className="p-6 space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold text-center mb-6">Get a Loan</h1>

      <LoanEligibility level={verificationLevel} />

      {currentStep === "application" ? (
        <LoanApplicationForm
          maxLoanAmount={10}
          verificationLevel={verificationLevel}
          onSubmit={handleLoanApplication}
        />
      ) : loanDetails ? (
        <LoanConfirmation
          amount={loanDetails.amount}
          duration={loanDetails.duration}
          transactionId={loanDetails.transactionId}
          onClose={() => setCurrentStep("application")}
        />
      ) : null}
    </div>
  );
};

export default LoanPage;
