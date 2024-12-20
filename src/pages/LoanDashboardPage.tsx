import { useNavigate } from "react-router";
import { CircularProgressbar } from "react-circular-progressbar";
import { Info } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/ui/tooltip";
import RepayLoanCard from "@/components/RepayLoanCard";
import { useMagnifyWorld } from "@/hooks/useMagnifyWorld";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { MiniKit } from "@worldcoin/minikit-js";

const LoanDashboardPage = () => {
  const navigate = useNavigate();
  const user = MiniKit.user;
  const { data, isLoading, isError } = useMagnifyWorld("0x2f79325b76cd2109cd9cf5320b6d23d7f682d65c");

  // TODO: These values should be fetched or computed based on loan data. Here's a placeholder calculation:
  const onTimeRepayments = 3; // This should be calculated based on loan history
  const creditScore = 100; // This should be computed or fetched from another source
  const creditScorePercentage = 40; // Placeholder, should be calculated or fetched

  if (isLoading) return <div className="container mx-auto p-6 text-center">Loading...</div>;
  if (isError) return <div className="container mx-auto p-6 text-center">Error fetching data.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Loan Dashboard</h1>
      <div className="gap-4 mb-8">
        <Card className="p-4 glass-card">
          <h4 className="text-sm text-brand-text-secondary mb-1">Active Loans</h4>
          <p className="text-2xl font-bold text-brand-text-primary">{data?.loans?.length || 0}</p>
        </Card>
      </div>
      <Card className="w-full p-6 bg-white/50 backdrop-blur-sm space-y-6">
        {data?.loans?.length > 0 ? (
          data.loans.map((loan) => <RepayLoanCard key={loan.amount.toString()} loan={loan} />)
        ) : (
          <div className="text-center">
            No active loans.
            <br />
            <Button onClick={() => navigate("/loan")} className="w-full mt-10">
              Request a new loan
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoanDashboardPage;

/*
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
*/
