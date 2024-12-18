import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface LoanConfirmationProps {
  amount: number;
  duration: number;
  transactionId: string;
  onClose: () => void;
}

const LoanConfirmation = ({ amount, duration, transactionId, onClose }: LoanConfirmationProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate blockchain transaction confirmation time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
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
    );
  }

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