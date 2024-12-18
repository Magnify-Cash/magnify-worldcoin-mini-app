import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface SignInButtonProps {
  onClick: () => void;
  isGlowing: boolean;
}

export const SignInButton = ({ onClick, isGlowing }: SignInButtonProps) => (
  <Button
    onClick={onClick}
    variant="outline"
    className={`flex-1 font-semibold shadow-sm transition-all duration-300 ${
      isGlowing ? "animate-button-glow" : "hover:animate-button-glow"
    }`}
  >
    <Wallet className="mr-2 h-4 w-4" />
    Sign In with Wallet
  </Button>
);