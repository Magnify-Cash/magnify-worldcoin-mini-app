import { useState } from "react";
import { X, Settings } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FundingOptions } from "@/components/FundingOptions";
import SignInModal from "@/components/SignInModal";
import WalletDashboard from "@/components/WalletDashboard";
import { VerificationLevel } from "@/types/verification";
import VerificationStatus from "@/components/verification/VerificationStatus";
import VerificationTiers from "@/components/verification/VerificationTiers";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"verify" | "onboarding" | "dashboard">("verify");
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showFundingOptions, setShowFundingOptions] = useState(false);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>("NONE");
  const [isVerifying, setIsVerifying] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const handleSignIn = () => {
    console.log("User signed in successfully");
    setCurrentStep("dashboard");
    toast.success("Successfully signed in!");
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setVerificationLevel("ORB");
      setIsVerifying(false);
      toast.success("Successfully verified with World ID!");
    }, 2000);
  };

  const renderContent = () => {
    switch (currentStep) {
      case "verify":
        return (
          <div className="space-y-8 text-center animate-fade-up">
            <div className="w-24 h-24 mx-auto bg-main-gradient rounded-xl flex items-center justify-center p-1 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                <img 
                  src="/lovable-uploads/b46231ff-456c-4295-be5d-1c49f557cea5.png" 
                  alt="World ID Logo" 
                  className="w-16 h-16" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-medium mb-2 text-brand-text-secondary">
                Sign in with World ID
              </h2>
              <button 
                className="w-full primary-button py-6"
                onClick={() => setShowSignInModal(true)}
              >
                Connect World ID
              </button>
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-8">
            <VerificationStatus
              currentLevel={verificationLevel}
              isVerifying={isVerifying}
              onVerify={handleVerify}
            />
            <VerificationTiers currentLevel={verificationLevel} />
            <WalletDashboard
              balance={walletBalance}
              onShowFundingOptions={() => setShowFundingOptions(true)}
              onShowHelpGuide={() => {}}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] font-['Bai_Jamjuree'] bg-radial-gradient">
      <div className="max-w-md mx-auto relative">
        <div className="flex justify-between items-center p-4 border-b border-white/20 backdrop-blur-sm bg-white/50 sticky top-0 z-10">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="h-6 w-6 text-brand-text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-brand-text-primary">
            MAGBot
          </h1>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Settings className="h-6 w-6 text-brand-text-primary" />
          </button>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>

        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSignIn={handleSignIn}
        />

        <Sheet open={showFundingOptions} onOpenChange={setShowFundingOptions}>
          <SheetContent side="bottom" className="h-[400px]">
            <FundingOptions onClose={() => setShowFundingOptions(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Index;