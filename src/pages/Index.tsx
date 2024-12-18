import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, X, Settings } from "lucide-react";
import { toast } from "sonner";
import SignInModal from "@/components/SignInModal";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FundingOptions } from "@/components/FundingOptions";
import { MascotIllustration } from "@/components/MascotIllustration";
import LoanApplicationForm from "@/components/loan/LoanApplicationForm";
import LoanConfirmation from "@/components/loan/LoanConfirmation";
import WalletDashboard from "@/components/WalletDashboard";
import { VerificationLevel } from "@/types/verification";

const ONBOARDING_SLIDES = [
  {
    title: "Welcome to MAGBot!",
    description: "Access gas-free, instant micro-loans with your World ID.",
    buttonText: "Next",
  },
  {
    title: "Bigger Loans for Verified Users!",
    description: "ORB Verified: $10 | Passport Verified: $3 | Non-Verified: $1.",
    buttonText: "Continue",
  },
  {
    title: "How It Works",
    description: "1. Verify your World ID\n2. Apply for a loan instantly\n3. Track repayments easily",
    buttonText: "Get Started",
  },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState<
    "verify" | "onboarding" | "dashboard" | "loan-application" | "loan-confirmation"
  >("verify");
  const [onboardingSlide, setOnboardingSlide] = useState(1);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showFundingOptions, setShowFundingOptions] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('NONE');
  const [loanDetails, setLoanDetails] = useState<{
    amount: number;
    duration: number;
    transactionId: string;
  } | null>(null);

  // Determine max loan amount based on verification level
  const maxLoanAmount = 10; // This would come from verification level

  const handleSignIn = () => {
    console.log("User signed in successfully");
    setCurrentStep("onboarding");
  };

  const handleNextSlide = () => {
    if (onboardingSlide < 3) {
      setOnboardingSlide(prev => prev + 1);
    } else {
      setCurrentStep("dashboard");
      toast.success("Welcome to MAGBot! You're all set to start.");
    }
  };

  const handleLoanApplication = (amount: number, duration: number) => {
    // Here we would integrate with smart contract
    const mockTransactionId = "0x" + Math.random().toString(16).substr(2, 40);
    setLoanDetails({
      amount,
      duration,
      transactionId: mockTransactionId
    });
    setCurrentStep("loan-confirmation");
    console.log("Loan application submitted:", { amount, duration, mockTransactionId });
  };

  const renderContent = () => {
    switch (currentStep) {
      case "verify":
        return (
          <div className="space-y-8 text-center animate-fade-up">
            <div className="w-24 h-24 mx-auto bg-main-gradient rounded-xl flex items-center justify-center p-1 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                <img src="/lovable-uploads/b46231ff-456c-4295-be5d-1c49f557cea5.png" alt="World ID Logo" className="w-16 h-16" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-medium mb-2 text-brand-text-secondary p-1 rounded bg-gradient-to-r from-brand-turquoise to-brand-coral bg-[length:100%_2px] bg-no-repeat bg-bottom">
                Sign in with World ID to secure a loan against your identity
              </h2>
              <p className="text-brand-text-secondary text-sm">To start exploring MAGBot</p>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full bg-main-gradient hover:scale-105 transition-all duration-300 text-white rounded-full py-6 shadow-lg"
                onClick={() => setShowSignInModal(true)}
              >
                Sign in with World ID
              </Button>
              <p className="text-xs text-brand-text-secondary">
                By clicking, you agree with <button className="text-brand-coral hover:underline">Terms</button>
              </p>
            </div>
          </div>
        );

      case "onboarding":
        const currentSlideContent = ONBOARDING_SLIDES[onboardingSlide - 1];
        return (
          <div className="space-y-8 animate-fade-up p-6">
            <div className="relative">
              <MascotIllustration step={onboardingSlide as 1 | 2 | 3} />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step === onboardingSlide ? "bg-brand-turquoise w-4" : "bg-brand-skyBlue"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-brand-text-primary">
                {currentSlideContent.title}
              </h2>
              <p className="text-brand-text-secondary">
                {currentSlideContent.description}
              </p>
              <Button
                className="w-full bg-main-gradient hover:scale-105 transition-all duration-300 text-white rounded-full py-6 shadow-lg"
                onClick={handleNextSlide}
              >
                {currentSlideContent.buttonText}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "loan-application":
        return (
          <LoanApplicationForm
            maxLoanAmount={10}
            onSubmit={handleLoanApplication}
          />
        );

      case "loan-confirmation":
        return loanDetails ? (
          <LoanConfirmation
            amount={loanDetails.amount}
            duration={loanDetails.duration}
            transactionId={loanDetails.transactionId}
            onClose={() => setCurrentStep("dashboard")}
          />
        ) : null;

      case "dashboard":
        return (
          <WalletDashboard
            balance={walletBalance}
            verificationLevel={verificationLevel}
            onShowFundingOptions={() => setShowFundingOptions(true)}
            onShowHelpGuide={() => {}}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] font-['Bai_Jamjuree'] bg-radial-gradient">
      <div className="max-w-md mx-auto relative">
        <div className="flex justify-between items-center p-4 border-b border-white/20 backdrop-blur-sm bg-white/50 sticky top-0 z-10">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="h-6 w-6 text-brand-text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-brand-text-primary p-1 rounded bg-gradient-to-r from-brand-turquoise to-brand-coral bg-[length:100%_2px] bg-no-repeat bg-bottom">
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