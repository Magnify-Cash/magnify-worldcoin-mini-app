import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface LoanConfirmationProps {
  amount: number;
  duration: number;
  transactionId: string;
  onClose: () => void;
}

const LoanConfirmation = ({ amount, duration, transactionId, onClose }: LoanConfirmationProps) => {
  return (
    <Card className="p-6 text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Loan Approved!</h3>
        <div className="space-y-1 text-gray-600">
          <p>Amount: ${amount}</p>
          <p>Duration: {duration} days</p>
          <p>APR: {duration === 7 ? "1.5%" : "2%"}</p>
          <p className="text-xs break-all mt-2">Transaction ID: {transactionId}</p>
        </div>
      </div>

      <Button onClick={onClose} className="w-full">
        View Dashboard
      </Button>
    </Card>
  );
};

export default LoanConfirmation;