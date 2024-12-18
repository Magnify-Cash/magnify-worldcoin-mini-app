import { 
  CreditCard, 
  DollarSign, 
  Euro, 
  PoundSterling,
  AppleIcon,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FundingOptionsProps {
  onClose: () => void;
}

export const FundingOptions = ({ onClose }: FundingOptionsProps) => {
  const handleAddFunds = (method: string) => {
    console.log(`Selected funding method: ${method}`);
    toast.info(`${method} funding option selected. This feature is coming soon!`);
    onClose();
  };

  const fundingMethods = [
    { name: 'Apple Pay', icon: AppleIcon },
    { name: 'Credit Card', icon: CreditCard },
    { name: 'Bank Transfer', icon: DollarSign },
    { name: 'International', icon: Euro },
  ];

  return (
    <div className="space-y-4 animate-fade-up pt-6">
      <h3 className="text-xl font-semibold mb-4">Select Funding Method</h3>
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full bg-modern-background border-modern-border"
            >
              Select Method
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-[350px]">
            {fundingMethods.map((method) => (
              <DropdownMenuItem
                key={method.name}
                onClick={() => handleAddFunds(method.name)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <method.icon className="h-4 w-4" />
                <span>{method.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};