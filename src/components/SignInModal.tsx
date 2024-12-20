import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { toast } from "sonner";
import { MiniKit } from "@worldcoin/minikit-js";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { Button } from "@/ui/button";
import { Wallet } from "lucide-react";

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

export const SignInModal = ({ isOpen, onClose, onSignIn }: SignInModalProps) => {
  const [rememberMe, setRememberMe] = useState(false);
  const { isGlowing, setIsGlowing } = useWalletAuth({ onSignIn, onClose });

  const handleSignIn = async () => {
    try {
      console.log("Initiating wallet authentication...");
      const nonce = crypto.randomUUID().replace(/-/g, "");

      MiniKit.commands.walletAuth({
        nonce,
        statement: "Sign in to Magnify Cash to manage your loans.",
        expirationTime: rememberMe
          ? new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
          : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });
    } catch (error) {
      console.error("Authentication failed:", error);
      toast.error("Failed to sign in. Please try again.");
      onClose();
    }
  };

  const handleMockSignIn = async () => {
    console.log("Initiating mock wallet authentication...");
    setIsGlowing(true);
    toast.success("Mock sign-in successful!");
    onSignIn();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Magnify Cash</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-gray-600">
            This app will see your wallet and allow you to manage loans.
          </p>

          <div className="flex flex-col gap-2">
            {/* Sign In button */}
            <Button
              onClick={handleSignIn}
              variant="outline"
              className={`flex-1 font-semibold shadow-sm transition-all duration-300 ${
                isGlowing ? "animate-button-glow" : "hover:animate-button-glow"
              }`}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Sign In with Wallet
            </Button>
            {/* End Sign In button */}

            {/* Mock Sign In button */}
            {/*
            <Button
              onClick={handleMockSignIn}
              variant="outline"
              className={`flex-1 font-semibold shadow-sm transition-all duration-300 ${
                isGlowing ? "animate-button-glow" : "hover:animate-button-glow"
              }`}
            >
              <TestTube className="mr-2 h-4 w-4" />
              Mock Sign In
            </Button>
             */}
            {/* End Mock Sign In button */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
