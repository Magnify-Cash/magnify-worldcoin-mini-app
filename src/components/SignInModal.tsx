import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { MiniKit } from "@worldcoin/minikit-js";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

const SignInModal = ({ isOpen, onClose, onSignIn }: SignInModalProps) => {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async () => {
    try {
      console.log("Initiating wallet authentication...");
      const nonce = Math.random().toString(36).substring(7);
      
      const authPayload = await MiniKit.commands.walletAuth({
        nonce,
        statement: "Sign in to MAGBot to manage your loans.",
        expirationTime: rememberMe
          ? new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
          : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      });

      if (authPayload) {
        console.log("Authentication successful:", authPayload);
        toast.success("Successfully signed in!");
        onSignIn();
      }
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