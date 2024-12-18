import { useState } from "react";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { VerificationLevel } from "@/types/verification";

interface LoanApplicationFormProps {
  maxLoanAmount: number;
  verificationLevel: VerificationLevel;
  onSubmit: (amount: number, duration: number) => void;
}

const LoanApplicationForm = ({ maxLoanAmount, verificationLevel, onSubmit }: LoanApplicationFormProps) => {
  const [amount, setAmount] = useState<string>("1");
  const [duration, setDuration] = useState<string>("30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (numAmount > maxLoanAmount) {
      toast.error(`Maximum loan amount is $${maxLoanAmount}`);
      return;
    }
    onSubmit(numAmount, parseInt(duration));
  };

  const getVerificationMessage = () => {
    switch (verificationLevel) {
      case "NONE":
        return "Get World ID verified to unlock higher loan amounts! Verify with Passport for $5 loans or get ORB verified for $10 loans.";
      case "PASSPORT":
        return "Get ORB verified to unlock $10 loans!";
      case "ORB":
        return "You're fully verified and eligible for maximum loan amounts!";
    }
  };

  const availableAmounts = () => {
    switch (verificationLevel) {
      case "ORB":
        return ["1", "5", "10"];
      case "PASSPORT":
        return ["1", "5"];
      default:
        return ["1"];
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Apply for a Loan</h3>
        <p className="text-sm text-gray-500">{getVerificationMessage()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Loan Amount ($)</Label>
          <Select value={amount} onValueChange={setAmount}>
            <SelectTrigger>
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              {availableAmounts().map((value) => (
                <SelectItem key={value} value={value}>
                  ${value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Loan Duration</Label>
          <RadioGroup value={duration} onValueChange={setDuration}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30" id="30days" />
              <Label htmlFor="30days">30 Days (1.5% APR)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="60" id="60days" />
              <Label htmlFor="60days">60 Days (2% APR)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="90" id="90days" />
              <Label htmlFor="90days">90 Days (2.5% APR)</Label>
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
