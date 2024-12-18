import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MiniKit } from "@worldcoin/minikit-js";
import { SignInButton } from "./auth/SignInButton";
import { MockSignInButton } from "./auth/MockSignInButton";
import { RememberMeOption } from "./auth/RememberMeOption";
import { useWalletAuth } from "@/hooks/useWalletAuth";

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

export const SignInModal = ({ isOpen, onClose, onSignIn }: SignInModalProps) => {
  const [rememberMe, setRememberMe] = useState(false);
  const { isGlowing, setIsGlowing, isMinikitAvailable } = useWalletAuth({ onSignIn, onClose });

  const handleSignIn = async () => {
    if (!isMinikitAvailable) {
      toast.error("Please open this app in World App to use wallet features");
      return;
    }

    try {
      console.log("Initiating wallet authentication...");
      const nonce = crypto.randomUUID().replace(/-/g, "");

      await MiniKit.commands.walletAuth({
        nonce,
        statement: "Sign in to MAGBot to manage your loans.",
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
          <DialogTitle className="text-2xl font-bold text-center">MAGBot 3.0</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-gray-600">
            This app will see your wallet and allow you to manage loans.
          </p>
          <RememberMeOption value={rememberMe} onChange={setRememberMe} />
          <div className="flex flex-col gap-2">
            <SignInButton onClick={handleSignIn} isGlowing={isGlowing} />
            <MockSignInButton onClick={handleMockSignIn} isGlowing={isGlowing} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
