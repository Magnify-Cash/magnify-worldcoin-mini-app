import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";

interface MockSignInButtonProps {
  onClick: () => void;
  isGlowing: boolean;
}

export const MockSignInButton = ({ onClick, isGlowing }: MockSignInButtonProps) => (
  <Button
    onClick={onClick}
    variant="outline"
    className={`flex-1 font-semibold shadow-sm transition-all duration-300 ${
      isGlowing ? "animate-button-glow" : "hover:animate-button-glow"
    }`}
  >
    <TestTube className="mr-2 h-4 w-4" />
    Mock Sign In
  </Button>
);