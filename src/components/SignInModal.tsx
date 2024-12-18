import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

const SignInModal = ({ isOpen, onClose, onSignIn }: SignInModalProps) => {
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    const handleAuthResponse = async (payload: any) => {
      console.log("Auth response received:", payload);
      if (payload.status === "error") {
        console.error("Authentication failed:", payload);
        toast.error("Failed to sign in. Please try again.");
        return;
      }

      try {
        // In a real app, you would verify this on your backend
        console.log("Authentication successful:", payload);
        toast.success("Successfully signed in!");
        onSignIn();
        onClose(); // Close the modal after successful sign-in
      } catch (error) {
        console.error("Error processing auth response:", error);
        toast.error("Failed to complete authentication. Please try again.");
      }
    };

    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, handleAuthResponse);

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
    };
  }, [onSignIn, onClose]); // Added onClose to dependency array

  const handleSignIn = async () => {
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            MAGBot 3.0
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-gray-600">
            This app will see your wallet and allow you to manage loans.
          </p>
          <RadioGroup
            defaultValue={rememberMe ? "remember" : "forget"}
            onValueChange={(value) => setRememberMe(value === "remember")}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="remember" id="remember" />
              <Label htmlFor="remember">Keep me signed in for future sessions</Label>
            </div>
          </RadioGroup>
          <Button
            onClick={handleSignIn}
            className="w-full bg-gradient-to-r from-worldcoin-primary to-worldcoin-secondary"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Sign In with Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;