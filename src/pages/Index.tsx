import { useState } from "react";
import SignInModal from "@/components/SignInModal";
import { HelpGuide } from "@/components/HelpGuide";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FundingOptions } from "@/components/FundingOptions";
import { MascotIllustration } from "@/components/MascotIllustration";
import WalletDashboard from "@/components/WalletDashboard";
import LoanDashboard from "@/components/LoanDashboard";
import { VerificationLevel } from "@/types/verification";
import { toast } from "sonner";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<
    "verify" | "onboarding" | "dashboard"
  >("verify");
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showFundingOptions, setShowFundingOptions] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('NONE');
  const [creditScore, setCreditScore] = useState(300);
  const [totalLoansRepaid, setTotalLoansRepaid] = useState(0);
  const [onTimeRepayments, setOnTimeRepayments] = useState(0);

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

  const renderContent = () => {
    switch (currentStep) {
      case "verify":
        return (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <MascotIllustration step={1} />
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Welcome to MAGBot</h1>
              <p className="text-xl text-gray-600">
                Your AI-powered lending companion
              </p>
            </div>
            <div className="w-full max-w-md space-y-4">
              <button
                onClick={() => setShowSignInModal(true)}
                className="w-full px-6 py-3 text-white bg-brand-turquoise font-semibold rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(45,255,249,0.5)] border-2 border-transparent hover:border-white/20"
              >
                Get Started
              </button>
            </div>
          </div>
        );

      case "onboarding":
        return (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg">
              <HelpGuide onClose={() => setCurrentStep("dashboard")} />
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="h-full overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              <LoanDashboard
                verificationLevel={verificationLevel}
                creditScore={creditScore}
                totalLoansRepaid={totalLoansRepaid}
                onTimeRepayments={onTimeRepayments}
              />
              <WalletDashboard
                balance={walletBalance}
                verificationLevel={verificationLevel}
                onShowFundingOptions={() => setShowFundingOptions(true)}
                onShowHelpGuide={() => setCurrentStep("onboarding")}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleSignIn}
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