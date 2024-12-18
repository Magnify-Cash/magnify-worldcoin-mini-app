import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  DollarSign, 
  Euro, 
  PoundSterling,
  AppleIcon
} from "lucide-react";
import { toast } from "sonner";

interface FundingOptionsProps {
  onClose: () => void;
}

export const FundingOptions = ({ onClose }: FundingOptionsProps) => {
  const handleAddFunds = (method: string) => {
    console.log(`Selected funding method: ${method}`);
    toast.info(`${method} funding option selected. This feature is coming soon!`);
    onClose();
  };

  return (
    <div className="space-y-4 animate-fade-up">
      <h3 className="text-xl font-semibold mb-4">Select Funding Method</h3>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex items-center justify-start space-x-2 p-4"
          onClick={() => handleAddFunds('Apple Pay')}
        >
          <AppleIcon className="h-5 w-5" />
          <span>Apple Pay</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-start space-x-2 p-4"
          onClick={() => handleAddFunds('Credit Card')}
        >
          <CreditCard className="h-5 w-5" />
          <span>Credit Card</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-start space-x-2 p-4"
          onClick={() => handleAddFunds('Bank Transfer')}
        >
          <DollarSign className="h-5 w-5" />
          <span>Bank Transfer</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-start space-x-2 p-4"
          onClick={() => handleAddFunds('International')}
        >
          <Euro className="h-5 w-5" />
          <span>International</span>
        </Button>
      </div>
    </div>
  );
};