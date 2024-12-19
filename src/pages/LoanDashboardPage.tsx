import { CircularProgressbar } from "react-circular-progressbar";
import { Info } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import RepayLoanCard from "@/components/loan/RepayLoanCard";
import useBorrowerDashboard from "@/hooks/useBorrowerDashboard";
import { Card } from "@/ui/card";

const LoanDashboardPage = () => {
  // TODO: fake data
  const totalLoansRepaid = 5;
  const onTimeRepayments = 3;
  const creditScore = 100;
  const creditScorePercentage = 400;

  // loan data
  const { data, isLoading, isError, error } = useBorrowerDashboard("0x", true);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <div className="container mx-auto p-6">
      <Card className="p-4 glass-card">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Your Loan Dashboard</h1>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 glass-card">
          <h4 className="text-sm text-brand-text-secondary mb-1">Total Loans Repaid</h4>
          <p className="text-2xl font-bold text-brand-text-primary">{totalLoansRepaid}</p>
        </Card>

        <Card className="p-4 glass-card">
          <h4 className="text-sm text-brand-text-secondary mb-1">On-time Repayments</h4>
          <p className="text-2xl font-bold text-brand-text-primary">{onTimeRepayments}</p>
        </Card>

        <Card className="p-4 glass-card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm text-brand-text-secondary mb-1">Credit Score</h4>
              <p className="text-2xl font-bold text-brand-text-primary">{creditScore}</p>
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
                Your credit score is calculated based on your loan repayment history. Scores range from 300 to
                850, with higher scores unlocking better loan terms.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Card>
      </div>
      <Card className="w-full p-6 bg-white/50 backdrop-blur-sm space-y-6">
        {data.loans.length > 0 ? (
          data.loans.map((loan) => <RepayLoanCard loan={loan} />)
        ) : (
          <div>no loans</div>
        )}
      </Card>
    </div>
  );
};

export default LoanDashboardPage;
