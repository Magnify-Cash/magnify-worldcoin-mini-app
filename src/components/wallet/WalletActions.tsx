import { Button } from "@/components/ui/button";
import { Plus, Send, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletActionsProps {
  onShowFundingOptions: () => void;
  onShowHelpGuide: () => void;
}

export const WalletActions = ({ onShowFundingOptions, onShowHelpGuide }: WalletActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-4">
      <Button 
        variant="outline"
        className="flex flex-col items-center justify-center gap-2 p-4 w-24 h-24 glass-card"
        onClick={onShowFundingOptions}
      >
        <Plus className="h-8 w-8" />
        <span>Buy</span>
      </Button>
      
      <Button 
        variant="outline"
        className="flex flex-col items-center justify-center gap-2 p-4 w-24 h-24 glass-card"
      >
        <Send className="h-8 w-8" />
        <span>Send</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="flex flex-col items-center justify-center gap-2 p-4 w-24 h-24 glass-card"
          >
            <MoreHorizontal className="h-8 w-8" />
            <span>More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-md">
          <DropdownMenuItem onClick={() => navigate("/")}>
            Home
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/loan")}>
            Get a Loan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            Loan Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onShowHelpGuide}>
            Help Guide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};