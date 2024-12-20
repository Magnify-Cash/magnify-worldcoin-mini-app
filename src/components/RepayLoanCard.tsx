import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import { CircularProgressbar } from "react-circular-progressbar";
import { Coins } from "lucide-react";
import { calculateRemainingTime } from "@/utils/timeinfo";

interface LoanType {
  amount: bigint;
  startTime: bigint;
  isActive: boolean;
  interestRate: bigint;
  loanPeriod: bigint;
}

const RepayLoanCard = ({ loan }: { loan: LoanType }) => {
  const handleRepay = () => {
    console.log("Initiating loan repayment");
    toast.success("Loan repayment initiated");
  };
  const [daysRemaining, hoursRemaining, minutesRemaining] = calculateRemainingTime(
    loan.startTime,
    loan.loanPeriod,
  );
  const progressPercentage = Math.max(0, Math.min(100, (1 / 30) * 100));
  return (
    <Card className="p-6 glass-card space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">Active Loan</h3>
          <div className="space-y-2">
            <p className="text-sm text-brand-text-secondary">Loan Amount: ${loan.amount.toString()}</p>
            <p className="text-sm text-brand-text-secondary">
              Interest Rate: {(loan.interestRate / BigInt(100)).toString()}%
            </p>
            <p className="text-sm text-brand-text-secondary">
              Due In: {daysRemaining} days, {hoursRemaining} hours, {minutesRemaining} minutes
            </p>
            <p className="text-lg font-semibold text-brand-text-primary">Total Due: TODO</p>
          </div>
        </div>
        <div className="w-20 h-20">
          <CircularProgressbar
            value={progressPercentage}
            text={`${daysRemaining}d`}
            styles={{
              path: {
                stroke: `rgba(34, 197, 94, ${progressPercentage / 100})`,
                strokeLinecap: "round",
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
      <Button onClick={handleRepay} className="w-full primary-button">
        <Coins className="mr-2 h-4 w-4" />
        Repay Loan
      </Button>
    </Card>
  );
};

export default RepayLoanCard;
