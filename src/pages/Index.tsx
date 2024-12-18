import { useState } from "react";
import { SignInModal } from "@/components/SignInModal";
import { HelpGuide } from "@/components/HelpGuide";
import { UserProfile } from "@/components/UserProfile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FundingOptions } from "@/components/FundingOptions";
import { MascotIllustration } from "@/components/MascotIllustration";
import WalletDashboard from "@/components/WalletDashboard";
import { VerificationLevel } from "@/types/verification";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<
    "verify" | "onboarding" | "dashboard"
  >("verify");
  const [onboardingSlide, setOnboardingSlide] = useState(1);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showFundingOptions, setShowFundingOptions] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('NONE');

  const handleSignIn = () => {
    console.log("User signed in successfully");
    setShowSignInModal(false);
    setCurrentStep("onboarding");
  };

  const handleVerificationComplete = (result: any) => {
    console.log("Verification completed:", result);
    if (result.proof) {
      setVerificationLevel('ORB');
      setCurrentStep("dashboard");
      toast.success("Welcome to MAGBot! You're all set to start.");
    }
  };

  const handleGetLoan = () => {
    navigate('/loan');
  };

  const renderContent = () => {
    switch (currentStep) {
      case "verify":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
            <MascotIllustration />
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Welcome to MAGBot</h1>
              <p className="text-xl text-gray-600">
                Your AI-powered lending companion
              </p>
            </div>
            <div className="w-full max-w-md space-y-4">
              <button
                onClick={() => setShowSignInModal(true)}
                className="w-full px-4 py-2 text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        );

      case "onboarding":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-lg">
              <HelpGuide
                currentSlide={onboardingSlide}
                onNext={() => {
                  if (onboardingSlide < 3) {
                    setOnboardingSlide(onboardingSlide + 1);
                  } else {
                    setCurrentStep("dashboard");
                  }
                }}
                onSkip={() => setCurrentStep("dashboard")}
              />
            </div>
          </div>
        );

      case "dashboard":
        return (
          <WalletDashboard
            balance={walletBalance}
            verificationLevel={verificationLevel}
            onGetLoan={handleGetLoan}
            onAddFunds={() => setShowFundingOptions(true)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-background to-brand-background-end">
      <UserProfile />
      {renderContent()}

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSignIn={handleSignIn}
        onVerificationComplete={handleVerificationComplete}
      />

      <Sheet open={showFundingOptions} onOpenChange={setShowFundingOptions}>
        <SheetContent>
          <FundingOptions onClose={() => setShowFundingOptions(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;