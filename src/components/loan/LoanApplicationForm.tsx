import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface LoanApplicationFormProps {
  maxLoanAmount: number;
  onSubmit: (amount: number, duration: number) => void;
}

const LoanApplicationForm = ({ maxLoanAmount, onSubmit }: LoanApplicationFormProps) => {
  const [amount, setAmount] = useState<number>(1);
  const [duration, setDuration] = useState<"7" | "14">("7");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > maxLoanAmount) {
      toast.error(`Maximum loan amount is $${maxLoanAmount}`);
      return;
    }
    if (amount < 1) {
      toast.error("Minimum loan amount is $1");
      return;
    }
    onSubmit(amount, parseInt(duration));
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Apply for a Loan</h3>
        <p className="text-sm text-gray-500">Maximum loan amount: ${maxLoanAmount}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Loan Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            max={maxLoanAmount}
            step="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Loan Duration</Label>
          <RadioGroup value={duration} onValueChange={(value) => setDuration(value as "7" | "14")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7" id="7days" />
              <Label htmlFor="7days">7 Days (1.5% APR)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="14" id="14days" />
              <Label htmlFor="14days">14 Days (2% APR)</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full">
          Apply Now
        </Button>
      </form>
    </Card>
  );
};

export default LoanApplicationForm;