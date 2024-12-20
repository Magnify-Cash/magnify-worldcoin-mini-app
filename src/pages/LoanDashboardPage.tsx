import { CircularProgressbar } from "react-circular-progressbar";
import { Info } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/ui/tooltip";
import RepayLoanCard from "@/components/RepayLoanCard";
import { useEffect, useState } from "react";
import { fetchLoansByAddress, getLoan } from "@/hooks/useMagnifyWorld";
import { Card } from "@/ui/card";

const LoanDashboardPage = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [userAddress, setUserAddress] = useState("0x123...");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUserLoans = async () => {
      setIsLoading(true);
      try {
        const loans = await fetchLoansByAddress("0x7745B9B74a0C7637fa5B74d5Fc106118bdBB0eE7");
        const loanDetails = await Promise.all(
          loans.map(async (loanId) => ({
            id: loanId,
            ...(await getLoan(Number(loanId.toString()))),
          })),
        );
        setActiveLoans(loanDetails);
      } catch (error) {
        console.error("Error fetching user loans:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLoans();
  }, [userAddress]);

  // TODO: These values should be fetched or computed based on loan data
  const totalLoansRepaid = 5;
  const onTimeRepayments = 3;
  const creditScore = 100;
  const creditScorePercentage = 400;

  if (isLoading) return <div className="container mx-auto p-6 text-center">Loading...</div>;
  if (isError) return <div className="container mx-auto p-6 text-center">Error fetching data.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Loan Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 glass-card">
          <h4 className="text-sm text-brand-text-secondary mb-1">Active Loans</h4>
          <p className="text-2xl font-bold text-brand-text-primary">{activeLoans.length}</p>
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
        {activeLoans.length > 0 ? (
          activeLoans.map((loan) => <RepayLoanCard key={loan.id} loan={loan} />)
        ) : (
          <div className="text-center">No active loans.</div>
        )}
      </Card>
    </div>
  );
};

export default LoanDashboardPage;
