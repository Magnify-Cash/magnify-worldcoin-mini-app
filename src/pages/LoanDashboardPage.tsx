import { VerificationLevel } from "@/types/verification";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { VerificationBadge } from "@/components/verification/VerificationBadge";
import { CircularProgressbar } from "react-circular-progressbar";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import { LoanEligibility } from "@/components/verification/LoanEligibility";
import RepayLoanCard from "@/components/loan/RepayLoanCard";
import "react-circular-progressbar/dist/styles.css";

const LoanDashboardPage = () => {
  // For now using static data, these could be fetched from an API later
  // Mock active loan data - this would come from your backend in a real app
  const verificationLevel: VerificationLevel = "NONE";
  const creditScore = 300;
  const totalLoansRepaid = 0;
  const onTimeRepayments = 0;
  const creditScorePercentage = ((creditScore - 300) / (850 - 300)) * 100;
  const hasActiveLoan = true;
  const activeLoan = {
    loanAmount: 5,
    dueDate: new Date(
      Date.now() + 25 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString(),
    interestRate: 1.5,
    totalDue: 5.08,
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full p-6 bg-white/50 backdrop-blur-sm space-y-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to Your Loan Dashboard
            </h1>
            <VerificationBadge level={verificationLevel} className="mb-4" />
          </div>
        </div>

        {hasActiveLoan && <RepayLoanCard {...activeLoan} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 glass-card">
            <h4 className="text-sm text-brand-text-secondary mb-1">
              Total Loans Repaid
            </h4>
            <p className="text-2xl font-bold text-brand-text-primary">
              {totalLoansRepaid}
            </p>
          </Card>

          <Card className="p-4 glass-card">
            <h4 className="text-sm text-brand-text-secondary mb-1">
              On-time Repayments
            </h4>
            <p className="text-2xl font-bold text-brand-text-primary">
              {onTimeRepayments}
            </p>
          </Card>

          <Card className="p-4 glass-card">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm text-brand-text-secondary mb-1">
                  Credit Score
                </h4>
                <p className="text-2xl font-bold text-brand-text-primary">
                  {creditScore}
                </p>
              </div>
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={creditScorePercentage}
                  text={`${creditScore}`}
                  styles={{
                    path: {
                      stroke: `rgba(45, 255, 249, ${creditScorePercentage / 100})`,
                      strokeLinecap: "round",
                      transition: "stroke-dashoffset 0.5s ease 0s",
                    },
                    trail: {
                      stroke: "#d6d6d6",
                      strokeLinecap: "round",
                    },
                    text: {
                      fill: "#374151",
                      fontSize: "24px",
                      fontWeight: "bold",
                    },
                  }}
                />
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-brand-text-secondary mt-2" />
                </TooltipTrigger>
                <TooltipContent>
                  Your credit score is calculated based on your loan repayment
                  history. Scores range from 300 to 850, with higher scores
                  unlocking better loan terms.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Card>
        </div>

        <LoanEligibility level={verificationLevel} />

        {verificationLevel === "NONE" && (
          <Button className="w-full primary-button">
            Get Verified with World ID
          </Button>
        )}
      </Card>
    </div>
  );
};

export default LoanDashboardPage;
